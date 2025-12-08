import { Injectable } from '@nestjs/common';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { users } from './user.schema';

@Injectable()
export class UserService {
  async create(data: { email: string; password: string; username?: string; role?: 'USER' | 'ADMIN' }) {
    return await db.insert(users).values(data).returning();
  }

  async findAll() {
    return await db.select().from(users);
  }

  async findById(id: number) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || null;
  }
}
