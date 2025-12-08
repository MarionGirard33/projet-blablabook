export interface CreateUserDto {
  email: string;
  password: string;
  username?: string;
  role?: 'USER' | 'ADMIN';
}


