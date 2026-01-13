import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import * as schema from 'src/db/schema';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Category } from './types/category';

@Injectable()
export class CategoryService {
  constructor(@Inject('DRIZZLE') private readonly db: NodePgDatabase<typeof schema>) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
   try {
      const [newCategory] = await this.db
        .insert(schema.category)
        .values({ ...createCategoryDto, isActive: createCategoryDto.isActive ?? true })
        .returning();
      return newCategory as Category;
    } catch (err: any) {
    console.error('Error creating category:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
      stack: err.stack,
    });

    // PostgreSQL unique_violation for Drizzle: err.cause?.code
    const pgErrorCode = err?.code || err?.cause?.code;
    if (pgErrorCode === '23505') {
      throw new ConflictException(`Category with name "${createCategoryDto.name}" already exists`);
    }

    throw err; // re-throw other errors
  }
}

  async findAll(): Promise<Category[]> {
    return this.db.select().from(schema.category).execute()
  .then(categories =>
    categories.map(c => ({ ...c, isActive: c.isActive ?? true }))
  );
  }

  async findOne(id: number): Promise<Category> {
    const [oneCategory] = await this.db
      .select()
      .from(schema.category)
      .where(eq(schema.category.id, id))
      .execute();

    if (!oneCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return {
      ...oneCategory,
      isActive: oneCategory.isActive ?? false,
    };
  }
}
