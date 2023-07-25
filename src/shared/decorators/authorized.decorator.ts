import { UseGuards, applyDecorators } from '@nestjs/common';
import { Role } from '../enums/roles';
import { Roles } from './role.metadata.decorator';
import { RoleGuard } from './is.allowed.decorator';
import { CompletedAccount } from './completed-account.metadata.decorator';

export function Authorized({
  role,
  completedAccount,
}: {
  role: Role[];
  completedAccount: boolean;
}) {
  return applyDecorators(
    Roles(role),
    CompletedAccount(completedAccount),
    UseGuards(RoleGuard),
  );
}
