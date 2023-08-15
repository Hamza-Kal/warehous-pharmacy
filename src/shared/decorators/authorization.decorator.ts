import { HttpCode, HttpStatus, applyDecorators } from '@nestjs/common';
import { Api } from '../enums/API';
import { Role } from '../enums/roles';
import { Authorized } from './authorized.decorator';
import { ApiMethods } from './get-api-methods/get.api.methods';

export function AuthorizedApi({
  api,
  url,
  role,
  created = true,
  completedAccount = [true],
}: {
  api: Api;
  url: string;
  role: Role[];
  created?: boolean;
  // indecate whether this api need to the information of the account must be completed or not
  completedAccount?: boolean[];
}) {
  return applyDecorators(
    Authorized({ role, completedAccount }),
    api === Api.POST && created
      ? HttpCode(HttpStatus.CREATED)
      : HttpCode(HttpStatus.OK),
    new ApiMethods(url).get(api),
  );
}
