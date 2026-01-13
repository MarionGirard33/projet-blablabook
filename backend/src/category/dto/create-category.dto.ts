import { IsString, IsNotEmpty, IsBoolean, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
  
  @IsBoolean()
  @IsNotEmpty()
  isActive?: boolean = true;
}
