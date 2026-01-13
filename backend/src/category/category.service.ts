import { Injectable, Inject, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import * as schema from 'src/db/schema';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Category } from './types/category';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(@Inject('DRIZZLE') private readonly db: NodePgDatabase<typeof schema>) {}

  /**
   * Create a new category. Throws ConflictException if name already exists.
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const [newCategory] = await this.db
        .insert(schema.category)
        .values({ ...createCategoryDto, isActive: createCategoryDto.isActive ?? true })
        .returning();

      return this.ensureIsActive(newCategory);
    } catch (err: any) {
      this.logger.error('Error creating category', err);

      const pgErrorCode = err?.code || err?.cause?.code;
      if (pgErrorCode === '23505') {
        throw new ConflictException(
          `Category with name "${createCategoryDto.name}" already exists`,
        );
      }

      throw err;
    }
  }

  /**
   * Find all categories
   */
  async findAll(): Promise<Category[]> {
    const categories = await this.db.select().from(schema.category).execute();
    return categories.map(this.ensureIsActive);
  }

  /**
   * Find one category by ID
   */
  async findOne(id: number): Promise<Category> {
    const [category] = await this.db
      .select()
      .from(schema.category)
      .where(eq(schema.category.id, id))
      .execute();

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.ensureIsActive(category);
  }

  /**
   * Find a category by name or create it if it doesn't exist
   */
  async findOrCreateByName(name: string): Promise<Category> {
    const [existingCategory] = await this.db
      .select()
      .from(schema.category)
      .where(eq(schema.category.name, name))
      .execute();

    if (existingCategory) {
      return this.ensureIsActive(existingCategory);
    }

    const [newCategory] = await this.db
      .insert(schema.category)
      .values({ name, isActive: true })
      .returning();

    return this.ensureIsActive(newCategory);
  }

  /**
   * Ensure `isActive` is always boolean
   */
  private ensureIsActive(category: any): Category {
    return {
      ...category,
      isActive: category.isActive ?? true,
    };
  }
}