import { Medicine } from 'src/medicine/entities/medicine.entities';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum OrderStatus {
  Pending = 'Pending',
  //TODO  complete all the status
  Delivered = 'Delivered',
  Rejected = 'Rejected',
}

@Entity()
export class WarehouseOrder {
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

  @Column({
    type: 'number',
  })
  totalPrice: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.warehouseOrder)
  supplier: Supplier;

  @OneToMany(
    () => WarehouseOrderDetails,
    (warehouseOrderDetails) => warehouseOrderDetails.warehouseOrder,
  )
  details: WarehouseOrderDetails[];
}

export class WarehouseOrderDetails {
  @ManyToOne(() => WarehouseOrder, (warehouseOrder) => warehouseOrder.details)
  warehouseOrder: WarehouseOrder;

  @ManyToOne(() => Medicine, (medicine) => medicine.orderDetails)
  medicine: Medicine;

  @Column({
    type: 'number',
  })
  quantity: number;

  @Column({
    type: 'number',
  })
  price: number;
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
