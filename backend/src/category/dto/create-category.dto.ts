import { IsString, IsNotEmpty, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateCategoryDto {
  @ApiProperty({
  description: 'Nom de la catégorie',
  example: 'Science Fiction',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Statut de la catégorie',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isActive?: boolean = true;
}
