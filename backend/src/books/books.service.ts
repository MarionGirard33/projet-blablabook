import { Injectable } from '@nestjs/common';
import { db } from '../db';
import { book, list, listBook } from '../db/schema';
import { CreateBookDto } from './dto/create-book.dto';
import { eq, and } from 'drizzle-orm';
import { BookSelect, ListBookSelect } from './types/books';

@Injectable()
export class BooksService {
  // -------------------------------------------------------
  // Get all books from the 'book' table
  // -------------------------------------------------------
  async findAllBooks(): Promise<BookSelect[]> {
    return db.select().from(book);
  }
  // -------------------------------------------------------
  // Get all books from a specific user's list
  // -------------------------------------------------------
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
      })
      .from(listBook)
      .innerJoin(book, eq(book.id, listBook.bookId))
      .innerJoin(list, eq(list.id, listBook.listId))
      .where(eq(list.userId, userId));

    // Add "status" property dynamically
    return rows.map((b) => ({
      ...b,
      status: b.readEnd ? 'Lu' : b.readStart ? 'En cours' : 'À lire',
    }));
  }

  // -------------------------------------------------------
  // Add a book to a user list
  // -------------------------------------------------------
  async addToUserList(
    userId: number,
    createBookDto: CreateBookDto,
  ): Promise<BookSelect> {
    // Check if the book already exists
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
          // convert Date into string because drizzle expects string for timestamps
          publishedAt: createBookDto.publishedAt.toString(),
        })
        .returning();

      existingBook = inserted[0];
    }

    // Retrieve existing user list
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

    // Add book to list
    await db
      .insert(listBook)
      .values({
        bookId: existingBook.id,
        listId: userList.id,
      })
      .returning();

    return existingBook;
  }

  // -------------------------------------------------------
  // Remove a book from user list
  // -------------------------------------------------------
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
}
