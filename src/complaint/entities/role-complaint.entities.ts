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

  @ManyToOne(() => Supplier, (supplier) => supplier.complaints)
  supplier: Supplier;
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

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.complaints)
  warehouse: Warehouse;
}

@Entity()
export class InventoryComplaint {
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

  @ManyToOne(() => Inventory, (inventory) => inventory.complaints)
  inventory: Inventory;
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

  @ManyToOne(() => Pharmacy, (pharmacy) => pharmacy.complaints)
  pharmacy: Pharmacy;
}
