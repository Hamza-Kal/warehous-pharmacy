import { Inventory } from 'src/inventory/entities/inventory.entity';
import {
  InventoryMedicine,
  SupplierMedicine,
} from 'src/medicine/entities/medicine-role.entities';

export class GetInventoriesDistributionsDto {
  id: number;
  name: string;
  quantity: number;
  managerName: string;
  phoneNumber: string;
  constructor({ inventoryMedicine }: { inventoryMedicine: InventoryMedicine }) {
    this.id = inventoryMedicine.id;
    this.name = inventoryMedicine.inventory.name;
    this.quantity = inventoryMedicine.quantity;
    this.managerName = inventoryMedicine.inventory.manager.fullName;
    this.phoneNumber = inventoryMedicine.inventory.phoneNumber;
  }

  toObject(): {
    id: number;
    name: string;
    quantity: number;
    managerName: string;
    phoneNumber: string;
  } {
    return {
      id: this.id,
      name: this.name,
      quantity: this.quantity,
      managerName: this.managerName,
      phoneNumber: this.phoneNumber,
    };
  }
}
