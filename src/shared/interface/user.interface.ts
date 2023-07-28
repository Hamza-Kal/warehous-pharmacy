import { Role } from '../enums/roles';

export interface IUser {
  email: string;
  id: number;
  role: Role;
  supplierId?: number;
  warehouseId?: number;
  pharmacyId?: number;
  inventoyId?: number;
}
