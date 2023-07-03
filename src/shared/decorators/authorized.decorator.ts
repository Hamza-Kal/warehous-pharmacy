import { applyDecorators } from '@nestjs/common';
import { Role } from '../enums/roles';
import { Roles } from './role.metadata.decorator';

export function Authorized({ role }: { role: Role }) {
  return applyDecorators(
    Roles(role),
    // continue from here
  );
}
