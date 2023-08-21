import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class SupplierComplaint {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  reason: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Supplier, (supplier) => supplier.complaints, {
    cascade: true,
  })
  @JoinColumn()
  supplier: Supplier;

  @ManyToOne(
    () => Warehouse,
    (complaintedWarehouse) => complaintedWarehouse.recievedSupplierComplaints,
    { cascade: true },
  )
  @JoinColumn()
  complaintedWarehouse: Warehouse;
}

@Entity()
export class WarehouseComplaint {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  reason: string;

  @CreateDateColumn()
  created_at: Date;

  // from
  @ManyToOne(() => Warehouse, (warehouse) => warehouse.complaints, {
    cascade: true,
  })
  @JoinColumn()
  warehouse: Warehouse;

  // to
  @ManyToOne(() => Supplier, (supplier) => supplier.recievedComplaints, {
    cascade: true,
  })
  @JoinColumn()
  complaintedSupplier: Supplier;

  // to
  @ManyToOne(() => Pharmacy, (pharmacy) => pharmacy.recievedComplaints, {
    cascade: true,
  })
  complaintedPharmacy: Pharmacy;
}

@Entity()
export class PharmacyComplaint {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  reason: string;

  @CreateDateColumn()
  created_at: Date;

  // from
  @ManyToOne(() => Pharmacy, (pharmacy) => pharmacy.complaints, {
    cascade: true,
  })
  @JoinColumn()
  pharmacy: Pharmacy;

  // to
  @ManyToOne(
    () => Warehouse,
    (warehouse) => warehouse.recievedPharmacyComplaints,
    {
      cascade: true,
    },
  )
  @JoinColumn()
  complaintedWarehouse: Warehouse;
}
