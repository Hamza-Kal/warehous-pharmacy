import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class PendingOrder_Pharmacy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  time_stamp: Date;

  @Column({ type: 'int' })
  total_price: number;

  @ManyToOne(() => Pharmacy, (pharmacy) => pharmacy.pendingOrdersPharmacy)
  pharmacy: Pharmacy;

  @ManyToOne(() => Inventory, (inventory) => inventory.pendingOrdersPharmacy)
  inventory: Inventory;
}
