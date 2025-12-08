export interface UpdateUserDto {
  email?: string;
  password?: string;
  username?: string;
  role?: 'USER' | 'ADMIN';
}
