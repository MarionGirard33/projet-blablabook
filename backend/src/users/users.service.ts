import { Injectable } from '@nestjs/common';
import { db } from '../db';
import { eq, or, and, isNull } from 'drizzle-orm';
import { users } from '../db/schema';
import { UserInsert, UserSelect } from './types/users';

@Injectable()
export class UsersService {
  async getUserByUsername(username: string): Promise<UserSelect | null> {
    const result = await db
      .select()
      .from(users)
      .where(and(eq(users.username, username), isNull(users.deletedAt)));

    return result[0] ?? null;
  }

  async checkUserExisting(
    username: string,
    email: string,
  ): Promise<UserSelect | null> {
    const result = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)));

    return result[0] ?? null;
  }

  async createUser(userInputData: UserInsert): Promise<UserSelect | null> {
    const result = await db.insert(users).values(userInputData).returning();
    return result[0] ?? null;
  }
}
