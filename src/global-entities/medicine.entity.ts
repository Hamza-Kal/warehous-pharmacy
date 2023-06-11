import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

@Entity()
export class Medicine {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  exp_date: Date;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.medicines, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  warehouse: Warehouse;
}
