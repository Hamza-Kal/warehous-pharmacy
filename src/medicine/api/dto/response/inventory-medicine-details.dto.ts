import {
  InventoryMedicine,
  InventoryMedicineDetails,
  WarehouseMedicine,
} from 'src/medicine/entities/medicine-role.entities';

export class InventoryMedicineDetailsDto {
  id: number;
  inventoryName: string;
  inventoryOwner: string;
  medicine: string;
  quantity: number;

  constructor({ details }: { details: InventoryMedicineDetails }) {
    this.id = details.id;
    this.inventoryName = details.medicine.inventory.name;
    this.inventoryOwner = details.medicine.inventory.manager.fullName;
    this.quantity = details.quantity;
    this.medicine = details.medicine.medicine.name;
  }

  toObject(): {
    id: number;
    inventoryName: string;
    inventoryOwner: string;
    medicine: string;
    quantity: number;
  } {
    return {
      id: this.id,
      inventoryName: this.inventoryName,
      inventoryOwner: this.inventoryOwner,
      medicine: this.medicine,
      quantity: this.quantity,
    };
  }
}
