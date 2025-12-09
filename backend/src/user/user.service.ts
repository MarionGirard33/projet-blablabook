import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { db } from 'src/db';

export class UserService {

  async update(id: number, data: UpdateUserDto) {
    const updateData = { ...data };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const [updatedUser] = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const { password, ...safeUser } = updatedUser;
    return safeUser;
  }

  async findById(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
