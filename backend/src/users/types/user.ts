import { users } from 'src/db/schema';

export type User = {
  id: number;
  email: string;
  password: string;
  username: string;
  role: string;
  createdAt: Date;
  updateAt: Date;
  deletedAt: Date;
};

export type SelectUser = typeof users.$inferSelect;
