import { Medicine } from 'src/medicine/entities/medicine.entities';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import {
  Column,
  Entity,
  JoinColumn,
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

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.warehouseOrder, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  warehouse: Warehouse;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  status: OrderStatus;

  @Column({
    type: 'int',
  })
  totalPrice: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.warehouseOrder, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  supplier: Supplier;

  @OneToMany(
    () => WarehouseOrderDetails,
    (warehouseOrderDetails) => warehouseOrderDetails.warehouseOrder,
  )
  details: WarehouseOrderDetails[];
}

@Entity()
export class WarehouseOrderDetails {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @ManyToOne(() => WarehouseOrder, (warehouseOrder) => warehouseOrder.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  warehouseOrder: WarehouseOrder;

  @ManyToOne(() => Medicine, (medicine) => medicine.warehoueOrderDetails)
  @JoinColumn()
  medicine: Medicine;

  @Column({
    type: 'int',
  })
  quantity: number;

  @Column({
    type: 'int',
  })
  price: number;
}

// @Entity()
// export class PharmacyOrders {
//   @PrimaryGeneratedColumn({
//     type: 'int',
//   })
//   id: number;

//   @ManyToOne(() => Pharmacy, (pharmacy) => pharmacy.pharmacyOrder, {
//     onDelete: 'CASCADE',
//   })
// @JoinColumn()
//   pharmacy: Pharmacy;
// }

// @Entity()
// export class PharmacyOrders {
//   @PrimaryGeneratedColumn({
//     type: 'int',
//   })
//   id: number;

//   @ManyToOne(() => PharmacyOrders)
// @JoinColumn()
//   phrmacyOrder: PharmacyOrders;
// }
