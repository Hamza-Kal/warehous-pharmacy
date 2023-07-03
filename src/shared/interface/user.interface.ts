import { Role } from '../enums/roles';

export interface IUser {
  username: string;
  id: number;
  role: Role;
}
