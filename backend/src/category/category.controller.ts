import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Category created successfully', type: CategoryResponseDto })
  @ApiBody({ type: CreateCategoryDto })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const newCategory = await this.categoryService.create(createCategoryDto);
    return {
      id: newCategory.id,
      name: newCategory.name,
      isActive: newCategory.isActive,
    };
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully', type: [CategoryResponseDto] })
  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryService.findAll();
    return categories.map(c => ({
      id: c.id,
      name: c.name,
      isActive: c.isActive,
    }));
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Category retrieved successfully', type: CategoryResponseDto })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CategoryResponseDto> {
    const category = await this.categoryService.findOne(id);
    return {
      id: category.id,
      name: category.name,
      isActive: category.isActive,
    };
  }
}
