export type User = {
  id: number;
  username: string;
  email: string;
  image?: string;
}

export type UpdateUserInput = {
  username: string;
  email: string;
  password?: string;
  image?: string;
};