import {
  Medicine,
  MedicineDetails,
} from 'src/medicine/entities/medicine.entities';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
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
  Delivered = 'Delivered',
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

  @OneToMany(
    () => WarehouseReturnOrderDetails,
    (warehouseReturnOrderDetails) =>
      warehouseReturnOrderDetails.warehouseReturnOrder,
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
// export class PharmacyReturnOrders {
//   @PrimaryGeneratedColumn({
//     type: 'int',
//   })
//   id: number;

//   @ManyToOne(() => Pharmacy, (pharmacy) => pharmacy.pharmacyReturnOrder, {
//     onDelete: 'CASCADE',
//   })
// @JoinColumn()
//   pharmacy: Pharmacy;
// }

// @Entity()
// export class PharmacyReturnOrders {
//   @PrimaryGeneratedColumn({
//     type: 'int',
//   })
//   id: number;

//   @ManyToOne(() => PharmacyReturnOrders)
// @JoinColumn()
//   phrmacyReturnOrder: PharmacyReturnOrders;
// }
