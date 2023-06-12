import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Medicine_Supplier } from "src/db-entities/medicine-entity/medicine-supplier.entity";
import { PendingOrder_Supplier } from "src/db-entities/pendingOrder-entity/pendingOrder-supplier.entity";

@Entity()
export class Supplier {
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
  phone_number: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(
    () => Medicine_Supplier,
    (medicineSupplier) => medicineSupplier.supplier,
  )
  medicines: Medicine_Supplier[];

  @OneToMany(
    () => PendingOrder_Supplier,
    (pendingOrderSupplier) => pendingOrderSupplier.supplier,
  )
  pendingOrdersSupplier: PendingOrder_Supplier[];
}
