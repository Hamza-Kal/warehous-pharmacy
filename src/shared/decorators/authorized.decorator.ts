import { UseGuards, applyDecorators } from '@nestjs/common';
import { Role } from '../enums/roles';
import { Roles } from './role.metadata.decorator';
import { RoleGuard } from './is.allowed.decorator';

export function Authorized({ role }: { role: Role[] }) {
  return applyDecorators(Roles(role), UseGuards(RoleGuard));
}
