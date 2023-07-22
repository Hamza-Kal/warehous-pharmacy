import { Role } from '../enums/roles';

export interface IUser {
  email: string;
  id: number;
  role: Role;
}
