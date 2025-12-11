import * as argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema';
import { NotFoundException } from '@nestjs/common';
import { db } from 'src/db';
import { plainToInstance } from 'class-transformer';
import { UpdateUserResponseDto } from './dto/update-user.response.dto';
import { UpdateUserRequestDto } from './dto/update-user.request.dto';

export class UserService {
  async update(id: number, data: UpdateUserRequestDto) {
    const updateData = { ...data };

    if (updateData.password) {
      updateData.password = await argon2.hash(updateData.password);
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    if (!updatedUser) {
      throw new NotFoundException(`User not found`);
    }

    return plainToInstance(UpdateUserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async findById(id: number) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return plainToInstance(UpdateUserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
