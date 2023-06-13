import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Inventory } from "src/inventory/entities/inventory.entity";
import { Medicine_Warehouse } from "src/db-entities/medicine-entity/medicine-warehouse.entity";
import { PendingOrder_Supplier } from "src/db-entities/pendingOrder-entity/pendingOrder-supplier.entity";

@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn({
    type: "int",
  })
  id: number;

  @Column({
    type: "varchar",
    length: 50,
    unique: true,
  })
  name: string;

  @Column({
    type: "varchar",
    length: 255,
  })
  location: string;

  @Column({
    type: "varchar",
    length: 15,
  })
  phoneNumber: string;

  @OneToOne(() => User)
  @JoinColumn()
  owner: User;

  @OneToMany(() => Inventory, (inventory) => inventory.warehouse)
  @JoinColumn()
  inventories: Inventory[];

  @OneToMany(
    () => Medicine_Warehouse,
    (medicineWarehouse) => medicineWarehouse.warehouse,
  )
  medicines: Medicine_Warehouse[];

  @OneToMany(
    () => PendingOrder_Supplier,
    (pendingOrderSupplier) => pendingOrderSupplier.warehouse,
  )
  pendingOrdersSupplier: PendingOrder_Supplier[];
}
