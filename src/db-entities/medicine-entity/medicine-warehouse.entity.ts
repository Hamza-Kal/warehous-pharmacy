import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Medicine } from './medicine.entity';
@Entity()
export class Medicine_Warehouse {
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

  @ManyToOne(() => Medicine, (medicine) => medicine.medicineWarehouses)
  medicine: Medicine;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.medicines)
  warehouse: Warehouse;
}
