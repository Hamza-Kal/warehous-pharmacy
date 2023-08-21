import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';

@AuthenticatedController({
  controller: 'complaint/warehouse',
})
export class ComplaintWarehouseController {
  // constructor() {}
}
