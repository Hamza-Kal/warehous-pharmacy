import { WarehouseMedicineService } from 'src/medicine/services/medicine-warehouse.service';
import { AuthenticatedController } from 'src/shared/decorators/authenticated.controller.decorator';

@AuthenticatedController({
  controller: 'medicine/warehouse',
})
export class MedicineWarehouseController {
  constructor(private warehouseMedicineService: WarehouseMedicineService) {}
}
