import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class PendingOrder_Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  time_stamp: Date;

  @Column({ type: 'int' })
  total_price: number;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.pendingOrdersSupplier)
  warehouse: Warehouse;

  @ManyToOne(() => Supplier, (supplier) => supplier.pendingOrdersSupplier)
  supplier: Supplier;
}
