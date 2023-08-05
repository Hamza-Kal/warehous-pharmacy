import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Medicine, MedicineDetails } from './medicine.entities';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';

// ####################  WarehouseMedicine  ####################

@Entity()
export class SupplierMedicine {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'int',
    default: 0,
  })
  quantity: number;

  @Column({
    type: 'int',
  })
  price: number;

  // ******************** Role ********************

  @ManyToOne(() => Supplier, (supplier) => supplier.supplierMedicine)
  @JoinColumn()
  supplier: Supplier;

  // ******************** Medicine ********************

  @OneToOne(() => Medicine, (medicine) => medicine.supplierMedicine)
  @JoinColumn()
  medicine: Medicine;

  // ******************** details ********************

  @OneToMany(
    () => SupplierMedicineDetails,
    (medicineDetails) => medicineDetails.medicine,
  )
  medicineDetails: SupplierMedicineDetails[];
}

@Entity()
export class SupplierMedicineDetails {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'int',
  })
  quantity: number;

  @ManyToOne(() => SupplierMedicine, (medicine) => medicine.medicineDetails)
  @JoinColumn()
  medicine: SupplierMedicine;

  @OneToOne(
    () => MedicineDetails,
    (medicineDetails) => medicineDetails.supplierMedicine,
  )
  @JoinColumn()
  medicineDetails: MedicineDetails;
}

@Entity()
export class WarehouseMedicine {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'int',
    default: 0,
  })
  quantity?: number;

  @Column({
    type: 'int',
    default: 0,
  })
  price?: number;

  // ******************** Role ********************

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.medicines)
  @JoinColumn()
  warehouse: Warehouse;

  // ******************** Medicine ********************

  @OneToOne(() => Medicine, (medicine) => medicine.warehouseMedicine)
  @JoinColumn()
  medicine: Medicine;

  // ******************** details ********************

  @OneToMany(
    () => WarehouseMedicineDetails,
    (medicineDetails) => medicineDetails.medicine,
  )
  medicineDetails: WarehouseMedicineDetails[];
}

@Entity()
export class WarehouseMedicineDetails {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'int',
    default: 0,
  })
  quantity: number;

  @Column({
    type: 'int',
    default: 0,
  })
  supplierLastPrice: number;

  @ManyToOne(() => WarehouseMedicine, (medicine) => medicine.medicineDetails)
  @JoinColumn()
  medicine: WarehouseMedicine;

  @OneToOne(
    () => MedicineDetails,
    (medicineDetails) => medicineDetails.warehouseMedicine,
  )
  @JoinColumn()
  medicineDetails: MedicineDetails;
}
@Entity()
export class InventoryMedicine {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'int',
    default: 0,
  })
  quantity: number;

  // ******************** Role ********************
  @ManyToOne(() => Inventory, (inventory) => inventory.medicines)
  @JoinColumn()
  inventory: Inventory;

  // ******************** Medicine ********************

  @OneToOne(() => Medicine, (medicine) => medicine.inventoryMedicine)
  @JoinColumn()
  medicine: Medicine;

  // ******************** details ********************

  @OneToMany(
    () => InventoryMedicineDetails,
    (medicineDetails) => medicineDetails.medicine,
  )
  @JoinColumn()
  medicineDetails: InventoryMedicineDetails[];
}

@Entity()
export class InventoryMedicineDetails {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'int',
  })
  quantity: number;

  @ManyToOne(() => InventoryMedicine, (medicine) => medicine.medicineDetails)
  @JoinColumn()
  medicine: InventoryMedicine;

  @OneToOne(
    () => MedicineDetails,
    (medicineDetails) => medicineDetails.inventoryMedicine,
  )
  @JoinColumn()
  medicineDetails: MedicineDetails;
}
@Entity()
export class PharmacyMedicine {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'int',
    default: 0,
  })
  quantity: number;

  @Column({
    type: 'int',
  })
  warehousePrice: number;

  // ******************** Role ********************
  @ManyToOne(() => Pharmacy, (pharmacy) => pharmacy.medicines)
  @JoinColumn()
  pharmacy: Pharmacy;

  // ******************** Medicine ********************
  @OneToOne(() => Medicine, (medicine) => medicine.pharmacyMedicine)
  @JoinColumn()
  medicine: Medicine;

  // ******************** Details ********************
  @OneToMany(
    () => PharmacyMedicineDetails,
    (medicineDetails) => medicineDetails.medicine,
  )
  @JoinColumn()
  medicineDetails: PharmacyMedicineDetails[];
}

@Entity()
export class PharmacyMedicineDetails {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'int',
  })
  quantity: number;

  @ManyToOne(() => PharmacyMedicine, (medicine) => medicine.medicineDetails)
  @JoinColumn()
  medicine: PharmacyMedicine;

  @OneToOne(
    () => MedicineDetails,
    (medicineDetails) => medicineDetails.pharmacyMedicine,
  )
  @JoinColumn()
  medicineDetails: MedicineDetails;
}
