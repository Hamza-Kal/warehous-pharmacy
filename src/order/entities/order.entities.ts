import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum OrderStatus {
  Pending = 'Pending',
  //TODO  complete all the status
  Delivered = 'Delivered',
  Rejected = 'Rejected',
}

@Entity()
export class WarehouseOrders {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.warehouseOrder)
  warehouse: Warehouse;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  status: OrderStatus;
}

@Entity()
export class PharmacyOrders {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @ManyToOne(() => Pharmacy, (pharmacy) => pharmacy.pharmacyOrder, {
    onDelete: 'CASCADE',
  })
  pharmacy: Pharmacy;
}

// @Entity()
// export class PharmacyOrders {
//   @PrimaryGeneratedColumn({
//     type: 'int',
//   })
//   id: number;

//   @ManyToOne(() => PharmacyOrders)
//   phrmacyOrder: PharmacyOrders;
// }
