import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Pharmacy } from "src/pharmacy/entities/pharmacy.entity";
import { Medicine } from "../medicine.entity";

@Entity()
export class Medicine_Pharmacy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  quantity: number;

  @Column()
  exp_date: Date;

  @Column({ type: "varchar", length: 255 })
  notes: string;

  @Column({ type: "boolean", default: false })
  isCorrupted: boolean;

  @ManyToOne(() => Pharmacy, (phramacy) => phramacy.medicines)
  pharmacy: Pharmacy;

  @ManyToOne(() => Medicine, (medicine) => medicine.medicinePharmacies)
  medicine: Medicine;
}
