import { Inventory } from "src/inventory/entities/inventory.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Medicine } from "../medicine.entity";

@Entity()
export class Medicine_Inventory {
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

  @ManyToOne(() => Medicine, (medicine) => medicine.medicineInventories)
  medicine: Medicine;

  @ManyToOne(() => Inventory, (inventory) => inventory.medicines)
  inventory: Inventory;
}
