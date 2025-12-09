import { Injectable } from '@nestjs/common';
import { db } from '../db';
import { book, list, listBook } from '../db/schema';
import { CreateBookDto } from './dto/create-book.dto';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class BooksService {
  // -------------------------------------------------------
  // Get all books from the 'book' table
  // -------------------------------------------------------
  async findAllBooks() {
    return db.select().from(book);
  }
  // -------------------------------------------------------
  // Get all books from a specific user's list
  // -------------------------------------------------------
  async findUserBooks(userId: number) {
    return db
      .select({
        id: book.id,
        name: book.name,
        coverId: book.coverId,
        author: book.author,
        description: book.description,
        isbn: book.isbn,
        publishingHouse: book.publishingHouse,
        publishedAt: book.publishedAt,
        listName: list.name,
      })
      .from(listBook)
      .innerJoin(book, eq(book.id, listBook.bookId))
      .innerJoin(list, eq(list.id, listBook.listId))
      .where(eq(list.userId, userId));
  }

  // -------------------------------------------------------
  // Add a book to a user list
  // -------------------------------------------------------
  async addToUserList(userId: number, createBookDto: CreateBookDto) {
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
    const newEntry = await db
      .insert(listBook)
      .values({
        bookId: existingBook.id,
        listId: userList.id,
      })
      .returning();

    return newEntry[0];
  }

  // -------------------------------------------------------
  // Remove a book from user list
  // -------------------------------------------------------
  async removeFromUserList(userId: number, bookId: number) {
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
