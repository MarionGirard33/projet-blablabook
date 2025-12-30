import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { db } from '../db';
import { book, list, listBook } from '../db/schema';
import { CreateBookDto } from './dto/create-book.dto';
import { eq, and, desc } from 'drizzle-orm';
import { BookSelect, ListBookSelect } from './types/books';
/**
 * BooksService encapsulates CRUD-like operations around books and user lists.
 * It reads/writes through Drizzle ORM and computes transient fields like status.
 */
@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);
  /**
   * Compute reading status without using nested ternaries to satisfy Sonar.
   */
  private computeStatus(
    readStart?: Date | string | null,
    readEnd?: Date | string | null,
  ): 'Lu' | 'En cours' | 'À lire' {
    if (readEnd) return 'Lu';
    if (readStart) return 'En cours';
    return 'À lire';
  }
  /**
   * Get all books from the `book` table.
   * @returns Array of persisted book records
   */
  async findAllBooks(): Promise<BookSelect[]> {
    return db.select().from(book);
  }
  /**
   * Get all books belonging to a specific user's list, enriched with a computed
   * `status` field based on `readStart`/`readEnd` dates and ordered by `addedAt`.
   * @param userId Target user id
   * @returns Array of user's books with transient status
   */
  async findUserBooks(userId: number): Promise<BookSelect[]> {
    const rows = await db
      .select({
        id: book.id,
        name: book.name,
        coverId: book.coverId,
        author: book.author,
        description: book.description,
        isbn: book.isbn,
        publishingHouse: book.publishingHouse,
        publishedAt: book.publishedAt,

        // Keep dates so we can compute status
        readStart: listBook.readStart,
        readEnd: listBook.readEnd,
        addedAt: listBook.addedAt,
      })
      .from(listBook)
      .innerJoin(book, eq(book.id, listBook.bookId))
      .innerJoin(list, eq(list.id, listBook.listId))
      .where(eq(list.userId, userId))
      .orderBy(desc(listBook.addedAt));

    // Compute "status" dynamically based on reading dates, avoiding nested ternaries
    return rows.map((b) => ({
      ...b,
      status: this.computeStatus(b.readStart, b.readEnd),
    }));
  }

  /**
   * Add a book to a user's list. If the book does not exist (by ISBN), it is
   * created first. If the user's list does not exist, it is created as well.
   * @param userId Target user id
   * @param createBookDto Payload from frontend (already normalized)
   * @returns The (existing or newly created) book record
   */
  async addToUserList(
    userId: number,
    createBookDto: CreateBookDto,
  ): Promise<BookSelect> {
    try {
      this.logger.debug(
        `addToUserList userId=${userId} payload=${JSON.stringify(createBookDto)}`,
      );

      // Check if the book already exists by ISBN to avoid duplicates
      const found = await db
        .select()
        .from(book)
        .where(eq(book.isbn, createBookDto.isbn));

      let existingBook = found[0];

      // Insert new book if not found
      if (!existingBook) {
        const inserted = await db
          .insert(book)
          .values({
            name: createBookDto.name,
            coverId: createBookDto.coverId,
            author: createBookDto.author,
            description: createBookDto.description,
            isbn: createBookDto.isbn,
            publishingHouse: createBookDto.publishingHouse,
            // publishedAt is already in YYYY-MM-DD format from frontend
            publishedAt: createBookDto.publishedAt,
          })
          .returning();

        existingBook = inserted[0];
      }

      // Retrieve (or lazily create) the user's list
      const userListFound = await db
        .select()
        .from(list)
        .where(eq(list.userId, userId));

      let userList = userListFound[0];

      // Create list if it does not exist
      if (!userList) {
        const created = await db
          .insert(list)
          .values({
            name: 'My List',
            userId,
          })
          .returning();

        userList = created[0];
      }

      // Link book to list in the join table
      await db
        .insert(listBook)
        .values({
          bookId: existingBook.id,
          listId: userList.id,
        })
        .returning();

      return existingBook;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error(
        'Failed to add book to user list',
        error.stack || error,
      );
      throw new HttpException(
        {
          message: 'Unable to add book to user list',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Remove a book from the user's list by unlinking it in the join table.
   * Returns the deleted join rows or null if the user has no list yet.
   * @param userId Target user id
   * @param bookId Book to unlink
   */
  async removeFromUserList(
    userId: number,
    bookId: number,
  ): Promise<ListBookSelect[] | null> {
    // Retrieve user list
    const userListFound = await db
      .select()
      .from(list)
      .where(eq(list.userId, userId));

    const userList = userListFound[0];

    if (!userList) return null;

    // Delete relation from listBook
    const deleted = await db
      .delete(listBook)
      .where(and(eq(listBook.bookId, bookId), eq(listBook.listId, userList.id)))
      .returning();

    return deleted;
  }

  /**
   * Update the reading dates (readStart, readEnd) for a book in a user's list.
   * This allows changing the computed status without storing status directly.
   * @param userId Target user id
   * @param bookId Target book id
   * @param readStart New readStart date (null to unset)
   * @param readEnd New readEnd date (null to unset)
   * @returns The updated book with computed status
   */
  async updateBookStatus(
    userId: number,
    bookId: number,
    readStart: Date | null,
    readEnd: Date | null,
  ): Promise<BookSelect> {
    try {
      // Find user's list
      const userListFound = await db
        .select()
        .from(list)
        .where(eq(list.userId, userId));

      const userList = userListFound[0];

      if (!userList) {
        throw new HttpException('User list not found', HttpStatus.NOT_FOUND);
      }

      // Update the listBook entry with new dates
      const updated = await db
        .update(listBook)
        .set({
          readStart,
          readEnd,
          updatedAt: new Date(),
        })
        .where(
          and(eq(listBook.bookId, bookId), eq(listBook.listId, userList.id)),
        )
        .returning();

      if (!updated || updated.length === 0) {
        throw new HttpException(
          'Book not found in user list',
          HttpStatus.NOT_FOUND,
        );
      }

      // Fetch the full book data to return
      const bookData = await db.select().from(book).where(eq(book.id, bookId));

      if (!bookData || bookData.length === 0) {
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
      }

      // Return book with computed status
      return {
        ...(bookData[0] as unknown as Record<string, unknown>),
        readStart: updated[0].readStart,
        readEnd: updated[0].readEnd,
        status: this.computeStatus(updated[0].readStart, updated[0].readEnd),
      } as unknown as BookSelect;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error('Failed to update book dates', error.stack || error);
      throw new HttpException(
        {
          message: 'Unable to update book dates',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
