import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';

@AuthenticatedController({
  controller: 'warehouse/supplier',
})
export class WarehouseSupplierController {}
