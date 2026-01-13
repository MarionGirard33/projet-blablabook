import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import * as schema from 'src/db/schema';
import { eq, is } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Category } from './types/category';

@Injectable()
export class CategoryService {
  constructor(@Inject('DRIZZLE') private readonly db: NodePgDatabase<typeof schema>) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const [newCategory] = await this.db
      .insert(schema.category)
      .values({ ...createCategoryDto, isActive: createCategoryDto.isActive ?? true })
      .returning();
    return newCategory as Category;
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

    // Ensure isActive is a boolean (convert null to false) to match Category type
    return {
      ...oneCategory,
      isActive: oneCategory.isActive ?? false,
    };
  }
}
