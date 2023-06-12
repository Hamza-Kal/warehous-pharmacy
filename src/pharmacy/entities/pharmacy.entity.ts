import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Medicine_Pharmacy } from "src/db-entities/medicine-entity/medicine-pharmacy.entity";
import { PendingOrder_Pharmacy } from "src/db-entities/pendingOrder-entity/pendingOrder-pharmacy.entity";

@Entity()
export class Pharmacy {
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
    () => Medicine_Pharmacy,
    (medicinePharmacy) => medicinePharmacy.pharmacy,
  )
  medicines: Medicine_Pharmacy[];

  @OneToMany(
    () => PendingOrder_Pharmacy,
    (pendinOrderPharmacy) => pendinOrderPharmacy.pharmacy,
  )
  pendingOrdersPharmacy: PendingOrder_Pharmacy[];
}
