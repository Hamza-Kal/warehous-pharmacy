import { Controller, UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

export function AuthenticatedController({
  controller,
}: {
  controller: string;
}) {
  return applyDecorators(UseGuards(JwtAuthGuard), Controller(controller));
}
