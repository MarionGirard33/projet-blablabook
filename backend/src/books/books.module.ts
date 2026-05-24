import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { CategoryModule } from '../category/category.module';
import { SecurityModule } from 'src/security/security.module';

@Module({
  imports: [CategoryModule, SecurityModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
