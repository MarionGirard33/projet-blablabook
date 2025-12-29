import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';

/**
 * REST controller for book-related routes.
 * Delegates business logic to `BooksService` and handles parameter parsing.
 */
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  /**
   * GET /books
   * Returns all books persisted in the `book` table (not user-specific).
   */
  @Get()
  async getAllBooks() {
    return this.booksService.findAllBooks();
  }

  /**
   * GET /books/library/:userId
   * Returns all books linked to the user's list, with a computed `status`.
   */
  @Get('library/:userId')
  async getUserBooks(@Param('userId', ParseIntPipe) userId: number) {
    return this.booksService.findUserBooks(userId);
  }

  /**
   * POST /books/library/:userId
   * Adds a book to the user's list, creating the book and/or list if needed.
   */
  @Post('library/:userId')
  async addBookToUserList(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createBookDto: CreateBookDto,
  ) {
    return this.booksService.addToUserList(userId, createBookDto);
  }

  /**
   * DELETE /books/library/:userId/book/:bookId
   * Removes the link between a book and the user's list.
   */
  @Delete('library/:userId/book/:bookId')
  async removeBookFromUserList(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.booksService.removeFromUserList(userId, bookId);
  }
}
