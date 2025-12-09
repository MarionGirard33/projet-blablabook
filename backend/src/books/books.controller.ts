import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async getBooks(
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
}
