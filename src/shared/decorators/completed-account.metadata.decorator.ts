import { SetMetadata } from '@nestjs/common';

export const CompletedAccount = (completedAccount: boolean) => {
  return SetMetadata('completedAccount', completedAccount);
};
