import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<string>('role', context.getHandler());
    const completedAccount = this.reflector.get<string>(
      'completedAccount',
      context.getHandler(),
    );

    if (!role) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    console.log('user', user, 'role', role);
    if (!user) return false;
    return (
      role.includes(user.role) &&
      completedAccount.includes(user.completedAccount)
    );
  }
}
