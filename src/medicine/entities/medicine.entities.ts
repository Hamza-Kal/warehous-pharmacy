import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import {
  InventoryMedicine,
  PharmacyMedicine,
  SupplierMedicine,
  WarehouseMedicine,
} from './medicine-role.entities';
import { Supplier } from 'src/supplier/entities/supplier.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  category: string;

  @OneToMany(() => Medicine, (medicine) => medicine.category)
  medicines: Medicine[];
}

@Entity()
export class Medicine {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id?: number;

  @ManyToOne(() => Category, (category) => category.medicines)
  category: Category;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  name: string;

  @Column({
    type: 'int',
  })
  price: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  description: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.medicine)
  supplier: Supplier;

  @OneToMany(
    () => MedicineDetails,
    (medicineDetails) => medicineDetails.medicine,
  )
  @JoinColumn()
  medicineDetails: MedicineDetails[];
}

@Entity()
export class MedicineDetails {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'date',
    nullable: false,
  })
  startDate: Date;

  @Column({
    type: 'date',
    nullable: false,
  })
  endDate: Date;

  @ManyToOne(() => Medicine, (medicine) => medicine.medicineDetails)
  @JoinColumn()
  medicine: Medicine;

  @OneToOne(
    () => WarehouseMedicine,
    (warehouseMedicine) => warehouseMedicine.medicineDetails,
  )
  warehouseMedicine: WarehouseMedicine;
  @OneToOne(
    () => PharmacyMedicine,
    (pharmacyMedicine) => pharmacyMedicine.medicineDetails,
  )
  pharmacyMedicine: PharmacyMedicine;
  @OneToOne(
    () => InventoryMedicine,
    (inventoryMedicine) => inventoryMedicine.medicineDetails,
  )
  inventoryMedicine: InventoryMedicine;
  @OneToOne(
    () => SupplierMedicine,
    (supplierMedicine) => supplierMedicine.medicineDetails,
  )
  supplierMedicine: SupplierMedicine;
}
