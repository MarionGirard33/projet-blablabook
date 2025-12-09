import { IsOptional, IsString, IsIn } from 'class-validator';

export class SearchBooksDto {
  @IsOptional()
  @IsIn(['random', 'category', 'search'])
  type: 'random' | 'category' | 'search';

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
