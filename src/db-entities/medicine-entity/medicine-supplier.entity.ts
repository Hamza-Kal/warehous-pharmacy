import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Medicine } from './medicine.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';

@Entity()
export class Medicine_Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column()
  exp_date: Date;

  @Column({ type: 'varchar', length: 255 })
  notes: string;

  @Column({ type: 'boolean', default: false })
  isCorrupted: boolean;

  @ManyToOne(() => Supplier, (supplier) => supplier.medicines)
  supplier: Supplier;

  @ManyToOne(() => Medicine, (medicine) => medicine.medicinePharmacies)
  medicine: Medicine;
}
