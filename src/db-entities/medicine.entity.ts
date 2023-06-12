import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Medicine_Inventory } from "./medicine-entity/medicine-inventory.entity";
import { Medicine_Pharmacy } from "./medicine-entity/medicine-pharmacy.entity";
import { Medicine_Supplier } from "./medicine-entity/medicine-supplier.entity";
import { Medicine_Warehouse } from "./medicine-entity/medicine-warehouse.entity";

@Entity()
export class Medicine {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar", length: 50, unique: true })
  name: string;

  @Column({ type: "varchar", length: 1024 })
  prescreption: string;

  @OneToMany(
    () => Medicine_Warehouse,
    (medicineWarehouse) => medicineWarehouse.medicine,
  )
  medicineWarehouses: Medicine_Warehouse[];

  @OneToMany(
    () => Medicine_Pharmacy,
    (medicinePharmacy) => medicinePharmacy.pharmacy,
  )
  medicinePharmacies: Medicine_Pharmacy[];

  @OneToMany(
    () => Medicine_Supplier,
    (medicineSupplier) => medicineSupplier.medicine,
  )
  medicineSuppliers: Medicine_Supplier[];

  @OneToMany(
    () => Medicine_Inventory,
    (medicineInventory) => medicineInventory.medicine,
  )
  medicineInventories: Medicine_Inventory[];
}
