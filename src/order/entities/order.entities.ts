import { Inventory } from 'src/inventory/entities/inventory.entity';
import {
  Medicine,
  MedicineDetails,
} from 'src/medicine/entities/medicine.entities';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { PharmacyReportMedicine } from 'src/report medicine/entities/report-medicine.entities';
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

export enum OrderStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Delivered = 'Delivered',
  Rejected = 'Rejected',
}

@Entity()
export class WarehouseOrder {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.warehouseOrder)
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

  @OneToMany(
    () => DistributionWarehouseOrder,
    (distributionWarehouseOrder) => distributionWarehouseOrder.order,
  )
  distribution: DistributionWarehouseOrder[];
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

  @ManyToOne(() => Medicine, (medicine) => medicine.warehouseOrderDetails)
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

@Entity()
export class DistributionWarehouseOrder {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;
  @ManyToOne(
    () => WarehouseOrder,
    (warehouseOrder) => warehouseOrder.distribution,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  @JoinColumn()
  order: WarehouseOrder;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'int',
    nullable: false,
  })
  quantity: number;
  @Column({
    type: 'int',
    nullable: false,
  })
  price: number;

  @ManyToOne(
    () => MedicineDetails,
    (medicineDetails) => medicineDetails.distribution,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  @JoinColumn()
  medicineDetails: MedicineDetails;
}

@Entity()
export class PharmacyOrder {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.pharmacyOrder)
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

  @ManyToOne(() => Pharmacy, (pharmacy) => pharmacy.pharmacyOrder, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  pharmacy: Pharmacy;

  @OneToMany(
    () => PharmacyOrderDetails,
    (pharmacyOrderDetails) => pharmacyOrderDetails.pharmacyOrder,
  )
  details: PharmacyOrderDetails[];

  @OneToMany(
    () => DistributionPharmacyOrder,
    (distributionPharmacyOrder) => distributionPharmacyOrder.order,
  )
  distribution: DistributionPharmacyOrder[];

  @OneToMany(
    () => PharmacyReportMedicine,
    (reportPharmacyOrder) => reportPharmacyOrder.order,
  )
  report: PharmacyReportMedicine[];
}

@Entity()
export class PharmacyOrderDetails {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @ManyToOne(() => PharmacyOrder, (pharmacyOrder) => pharmacyOrder.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  pharmacyOrder: PharmacyOrder;

  @ManyToOne(() => Medicine, (medicine) => medicine.pharmacyOrderDetails)
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

@Entity()
export class DistributionPharmacyOrder {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @ManyToOne(() => Inventory, (inventory) => inventory.distribution)
  @JoinColumn()
  inventory: Inventory;

  @ManyToOne(
    () => MedicineDetails,
    (medicineDetails) => medicineDetails.distributionPharmacy,
  )
  @JoinColumn()
  medicineDetails: MedicineDetails;

  @Column({
    type: 'int',
  })
  quantity: number;

  @ManyToOne(() => PharmacyOrder, (pharmacyOrder) => pharmacyOrder.distribution)
  @JoinColumn()
  order: PharmacyOrder;
}
