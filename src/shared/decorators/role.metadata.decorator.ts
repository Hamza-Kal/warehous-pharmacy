import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/roles';

export const Roles = (role: Role) => SetMetadata('role', role);
