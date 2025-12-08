export interface User {
  id: number;
  email: string;
  password: string;
  username?: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

