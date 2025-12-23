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

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // -----------------------------
  // Get all books
  // -----------------------------
  @Get()
  async getAllBooks() {
    return this.booksService.findAllBooks();
  }

  // -----------------------------
  // Get all books for a specific user
  // -----------------------------
  @Get('library/:userId')
  async getUserBooks(@Param('userId', ParseIntPipe) userId: number) {
    return this.booksService.findUserBooks(userId);
  }

  // -----------------------------
  // Add a book to a user's list
  // -----------------------------
  @Post('library/:userId')
  async addBookToUserList(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createBookDto: CreateBookDto,
  ) {
    return this.booksService.addToUserList(userId, createBookDto);
  }

  // -----------------------------
  // Remove a book from a user's list
  // -----------------------------
  @Delete('library/:userId/book/:bookId')
  async removeBookFromUserList(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.booksService.removeFromUserList(userId, bookId);
  }
}
