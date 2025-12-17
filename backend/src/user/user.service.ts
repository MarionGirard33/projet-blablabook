import * as argon2 from 'argon2';
import { eq, or, and, isNull } from 'drizzle-orm';
import { user } from '../db/schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from 'src/db';
import { plainToInstance } from 'class-transformer';
import { UpdateUserResponseDto } from './dto/update-user.response.dto';
import { UpdateUserRequestDto } from './dto/update-user.request.dto';
import { UserInsert, UserSelect } from './types/user';

@Injectable()
export class UserService {
  async getUserByUsername(username: string): Promise<UserSelect | null> {
      const result = await db
        .select()
        .from(user)
        .where(and(eq(user.username, username), isNull(user.deletedAt)));
  
      return result[0] ?? null;
    }

  async checkUserExisting(
      username: string,
      email: string,
    ): Promise<UserSelect | null> {
      const result = await db
        .select()
        .from(user)
        .where(or(eq(user.email, email), eq(user.username, username)));
  
      return result[0] ?? null;
    }
  
  async createUser(userInputData: UserInsert): Promise<UserSelect | null> {
    const result = await db.insert(user).values(userInputData).returning();
    return result[0] ?? null;
  }

  async update(id: number, data: UpdateUserRequestDto) {
    const updateData = { ...data };

    if (updateData.password) {
      updateData.password = await argon2.hash(updateData.password);
    }

    const [updatedUser] = await db
      .update(user)
      .set(updateData)
      .where(eq(user.id, id))
      .returning();

    if (!updatedUser) {
      throw new NotFoundException(`User not found`);
    }

    return plainToInstance(UpdateUserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async findById(id: number) {
    const [userRow] = await db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    if (!userRow) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return plainToInstance(UpdateUserResponseDto, userRow, {
      excludeExtraneousValues: true,
    });
  }
}
