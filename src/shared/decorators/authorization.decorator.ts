import { HttpCode, HttpStatus, applyDecorators } from '@nestjs/common';
import { Api } from '../enums/API';
import { Role } from '../enums/roles';

export function AuthorizedApi({
  api,
  role,
  created,
}: {
  api: Api;
  role: Role;
  created?: boolean | true;
}) {
  return applyDecorators(
    api === Api.POST && created
      ? HttpCode(HttpStatus.CREATED)
      : HttpCode(HttpStatus.ACCEPTED),

    Authorized({role})
  );
}
