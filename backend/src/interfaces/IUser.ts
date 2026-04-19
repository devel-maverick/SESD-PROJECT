export type UserRole = 'user' | 'admin';

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserPayload {
  id: string;
  role: UserRole;
}
