import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';

@AuthenticatedController({
  controller: 'complaint/admin',
})
export class ComplaintAdminController {
  // constructor() {}
}
