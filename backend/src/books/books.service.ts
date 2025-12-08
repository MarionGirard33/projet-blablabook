import { Injectable } from '@nestjs/common';
import { db } from '../db'; // Drizzle instance
import { book, list, listBook } from '../db/schema';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  // -----------------------------
  // Get all books from a specific user's list
  // -----------------------------
  async findUserBooks(userId: number) {
    return db
      .select()
      .from(listBook)
      .innerJoin(book, book.id.equals(listBook.bookId))
      .innerJoin(list, list.id.equals(listBook.listId))
      .where(list.userId.equals(userId))
      .all();
  }

  // -----------------------------
  // Add a book to a user's list
  // If the book does not exist in 'book' table, create it first
  // -----------------------------
  async addToUserList(userId: number, createBookDto: CreateBookDto) {
    // Check if the book already exists (by ISBN)
    let existingBook = await db
      .select()
      .from(book)
      .where(book.isbn.equals(createBookDto.isbn))
      .get();

    // If the book doesn't exist, insert it
    if (!existingBook) {
      const [insertedBook] = await db
        .insert(book)
        .values({
          name: createBookDto.name,
          coverId: createBookDto.coverId,
          author: createBookDto.author,
          description: createBookDto.description,
          isbn: createBookDto.isbn,
          publishingHouse: createBookDto.publishingHouse,
          publishedAt: createBookDto.publishedAt,
        })
        .returning();
      existingBook = insertedBook;
    }

    // Get the user's list (create one if it doesn't exist)
    let userList = await db
      .select()
      .from(list)
      .where(list.userId.equals(userId))
      .get();

    if (!userList) {
      const [newList] = await db
        .insert(list)
        .values({ name: 'My List', userId })
        .returning();
      userList = newList;
    }

    // Add the book to the user's list (even if the book already exists globally)
    const [listBookEntry] = await db
      .insert(listBook)
      .values({
        bookId: existingBook.id,
        listId: userList.id,
      })
      .returning();

    return listBookEntry;
  }

  // -----------------------------
  // Remove a book from a user's list (does not delete from 'book' table)
  // -----------------------------
  async removeFromUserList(userId: number, bookId: number) {
    // Get the user's list
    const userList = await db
      .select()
      .from(list)
      .where(list.userId.equals(userId))
      .get();

    if (!userList) return null;

    // Soft delete or remove the entry from listBook
    const deleted = await db
      .delete(listBook)
      .where(
        listBook.bookId.equals(bookId).and(listBook.listId.equals(userList.id)),
      )
      .returning();

    return deleted;
  }
}
