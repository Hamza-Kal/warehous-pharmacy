import { HttpCode, HttpStatus, applyDecorators } from '@nestjs/common';
import { Api } from '../enums/API';
import { Role } from '../enums/roles';
import { Authorized } from './authorized.decorator';
import { ApiMethods } from './get-api-methods/get.api.methods';

export function AuthorizedApi({
  api,
  url,
  role,
  created,
}: {
  api: Api;
  url: string;
  role: Role[];
  created?: boolean | true;
}) {
  return applyDecorators(
    Authorized({ role }),
    api === Api.POST && created
      ? HttpCode(HttpStatus.CREATED)
      : HttpCode(HttpStatus.ACCEPTED),
    new ApiMethods(url).get(api),
  );
}
