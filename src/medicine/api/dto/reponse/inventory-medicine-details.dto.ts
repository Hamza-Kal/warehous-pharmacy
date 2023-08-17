import {
  InventoryMedicine,
  InventoryMedicineDetails,
  WarehouseMedicine,
} from 'src/medicine/entities/medicine-role.entities';

export class InventoryMedicineDetailsDto {
  id: number;
  inventoryName: string;
  inventoryOwner: string;
  quantity: number;

  constructor({ details }: { details: InventoryMedicineDetails }) {
    this.id = details.id;
    this.inventoryName = details.medicine.inventory.name;
    this.inventoryOwner = details.medicine.inventory.manager.fullName;
    this.quantity = details.quantity;
  }

  toObject(): {
    id: number;
    inventoryName: string;
    inventoryOwner: string;
    quantity: number;
  } {
    return {
      id: this.id,
      inventoryName: this.inventoryName,
      inventoryOwner: this.inventoryOwner,
      quantity: this.quantity,
    };
  }
}
