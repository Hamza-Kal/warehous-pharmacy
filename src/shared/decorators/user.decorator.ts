import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {k
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
