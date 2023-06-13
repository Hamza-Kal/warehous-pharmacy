import { Medicine_Inventory } from "src/db-entities/medicine-entity/medicine-inventory.entity";
import { PendingOrder_Pharmacy } from "src/db-entities/pendingOrder-entity/pendingOrder-pharmacy.entity";
import { User } from "src/user/entities/user.entity";
import { Warehouse } from "src/warehouse/entities/warehouse.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Inventory {
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
  manager: User;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.inventories)
  @JoinColumn()
  warehouse: Warehouse;

  @OneToMany(
    () => Medicine_Inventory,
    (medicineInventory) => medicineInventory.inventory,
  )
  medicines: Medicine_Inventory[];

  @OneToMany(
    () => PendingOrder_Pharmacy,
    (pendinOrderPharmacy) => pendinOrderPharmacy.inventory,
  )
  pendingOrdersPharmacy: PendingOrder_Pharmacy[];
}
