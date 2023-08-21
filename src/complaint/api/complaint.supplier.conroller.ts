import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';

@AuthenticatedController({
  controller: 'complaint/supplier',
})
export class ComplaintSupplierController {
  // constructor() {}
}
