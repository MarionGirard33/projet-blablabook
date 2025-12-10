import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // -----------------------------
  // Get books by: search, category, theme
  // -----------------------------
  @Get('search')
  async getSearchBooks(
    @Query('type') type: string,
    @Query('searchText') searchText?: string,
    @Query('categoryName') categoryName?: string,
  ) {
    if (!type) {
      throw new BadRequestException("The 'type' parameter is required.");
    }
    if (type === 'category') {
      if (!categoryName) {
        throw new BadRequestException(
          "Both 'type=category' and 'categoryName' parameters are required.",
        );
      }
      return this.booksService.getExternalBooksByCategoryName(categoryName);
    }
    if (type === 'search') {
      if (!searchText) {
        throw new BadRequestException(
          "Both 'type=search' and 'searchText' parameters are required.",
        );
      }
      return this.booksService.searchExternalBooks(searchText);
    }
    if (type === 'random') {
      if (categoryName || searchText) {
        throw new BadRequestException(
          "'categoryName' and 'searchText' should not be provided when type=random.",
        );
      }
      return this.booksService.getRandomExternalBooks();
    }
  }

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
  @Get('user/:userId')
  async getUserBooks(@Param('userId', ParseIntPipe) userId: number) {
    return this.booksService.findUserBooks(userId);
  }

  // -----------------------------
  // Add a book to a user's list
  // -----------------------------
  @Post('user/:userId')
  async addBookToUserList(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createBookDto: CreateBookDto,
  ) {
    return this.booksService.addToUserList(userId, createBookDto);
  }

  // -----------------------------
  // Remove a book from a user's list
  // -----------------------------
  @Delete('user/:userId/book/:bookId')
  async removeBookFromUserList(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.booksService.removeFromUserList(userId, bookId);
  }
}
