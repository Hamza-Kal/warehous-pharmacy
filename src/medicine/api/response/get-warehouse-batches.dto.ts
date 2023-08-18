import {
  SupplierMedicine,
  WarehouseMedicineDetails,
} from 'src/medicine/entities/medicine-role.entities';
import { Medicine } from 'src/medicine/entities/medicine.entities';

export class WarehouseGetBatches {
  quantity: number;
  id: number;
  constructor({
    warehouseBatches,
  }: {
    warehouseBatches: WarehouseMedicineDetails;
  }) {
    this.quantity = warehouseBatches.quantity;
    this.id = warehouseBatches.id;
  }

  toObject(): { quantity: number; id: number } {
    return {
      id: this.id,
      quantity: this.quantity,
    };
  }
}
