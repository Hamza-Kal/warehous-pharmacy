import {
  Medicine,
  MedicineDetails,
} from 'src/medicine/entities/medicine.entities';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ReturnOrderStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
}

@Entity()
export class WarehouseReturnOrder {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.returnOrder, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  warehouse: Warehouse;

  @Column({
    type: 'varchar',
    length: 255,
  })
  reason: string;

  @Column({
    type: 'enum',
    enum: ReturnOrderStatus,
    default: ReturnOrderStatus.Pending,
  })
  status: ReturnOrderStatus;

  @Column({
    type: 'int',
  })
  totalPrice: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.warehouseReturnOrder, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  supplier: Supplier;

  @ManyToOne(() => Medicine, (medicine) => medicine.warehouseReturnOrder)
  @JoinColumn()
  medicine: Medicine;

  @OneToMany(
    () => WarehouseReturnOrderDetails,
    (warehouseReturnOrderDetails) =>
      warehouseReturnOrderDetails.warehouseReturnOrder,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  details: WarehouseReturnOrderDetails[];
}

@Entity()
export class WarehouseReturnOrderDetails {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @ManyToOne(
    () => WarehouseReturnOrder,
    (warehouseReturnOrder) => warehouseReturnOrder.details,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  warehouseReturnOrder: WarehouseReturnOrder;

  @ManyToOne(
    () => MedicineDetails,
    (medicineDetails) => medicineDetails.warehouseReturnOrderDetails,
  )
  @JoinColumn()
  medicineDetails: MedicineDetails;

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
// export class PharmacyReturnOrder {
//   @PrimaryGeneratedColumn({
//     type: 'int',
//   })
//   id: number;

//   @CreateDateColumn()
//   created_at: Date;

//   @ManyToOne(() => Warehouse, (warehouse) => warehouse.returnOrder, {
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn()
//   warehouse: Warehouse;

//   @Column({
//     type: 'enum',
//     enum: ReturnOrderStatus,
//     default: ReturnOrderStatus.Pending,
//   })
//   status: ReturnOrderStatus;

//   @Column({
//     type: 'int',
//   })
//   totalPrice: number;

//   @ManyToOne(() => Pharmacy, (pharmacy) => pharmacy.returnOrder, {
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn()
//   pharmacy: Pharmacy;

//   @ManyToOne(() => Medicine, (medicine) => medicine.warehouseReturnOrder)
//   @JoinColumn()
//   medicine: Medicine;

//   @OneToMany(
//     () => WarehouseReturnOrderDetails,
//     (warehouseReturnOrderDetails) =>
//       warehouseReturnOrderDetails.warehouseReturnOrder,
//     {
//       onDelete: 'CASCADE',
//       onUpdate: 'CASCADE',
//     },
//   )
//   details: WarehouseReturnOrderDetails[];
// }

// @Entity()
// export class WarehouseReturnOrderDetails {
//   @PrimaryGeneratedColumn({
//     type: 'int',
//   })
//   id: number;

//   @ManyToOne(
//     () => WarehouseReturnOrder,
//     (warehouseReturnOrder) => warehouseReturnOrder.details,
//     {
//       onDelete: 'CASCADE',
//     },
//   )
//   @JoinColumn()
//   warehouseReturnOrder: WarehouseReturnOrder;

//   @ManyToOne(
//     () => MedicineDetails,
//     (medicineDetails) => medicineDetails.warehouseReturnOrderDetails,
//   )
//   @JoinColumn()
//   medicineDetails: MedicineDetails;

//   @Column({
//     type: 'int',
//   })
//   quantity: number;

//   @Column({
//     type: 'int',
//   })
//   price: number;
// }
