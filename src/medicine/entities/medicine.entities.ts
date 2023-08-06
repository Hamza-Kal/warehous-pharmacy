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
  InventoryMedicineDetails,
  PharmacyMedicine,
  PharmacyMedicineDetails,
  SupplierMedicine,
  SupplierMedicineDetails,
  WarehouseMedicine,
  WarehouseMedicineDetails,
} from './medicine-role.entities';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import {
  DistributionWarehouseOrder,
  WarehouseOrderDetails,
} from 'src/order/entities/order.entities';
import { WarehouseReturnOrderDetails } from 'src/return order/entities/returnOrder.entities';

// ####################  Category  ####################
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

// ####################  Medicine  ####################
@Entity()
export class Medicine {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @ManyToOne(() => Category, (category) => category.medicines)
  @JoinColumn()
  category: Category;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  description: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.medicine, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  supplier: Supplier;

  //******************** Details ********************

  @OneToMany(
    () => MedicineDetails,
    (medicineDetails) => medicineDetails.medicine,
  )
  medicineDetails: MedicineDetails[];

  //******************** Order ********************

  @OneToMany(
    () => WarehouseOrderDetails,
    (warehouseOrderDetails) => warehouseOrderDetails.medicine,
  )
  warehouseOrderDetails: WarehouseOrderDetails[];

  //******************** Roles ********************

  @OneToOne(
    () => SupplierMedicine,
    (supplierMedicine) => supplierMedicine.medicine,
  )
  supplierMedicine: SupplierMedicine;

  @OneToOne(
    () => WarehouseMedicine,
    (warehouseMedicine) => warehouseMedicine.medicine,
  )
  warehouseMedicine: WarehouseMedicine;

  @OneToOne(
    () => InventoryMedicine,
    (inventoryMedicine) => inventoryMedicine.medicine,
  )
  inventoryMedicine: InventoryMedicine;

  @OneToOne(
    () => PharmacyMedicine,
    (pharmacyMedicine) => pharmacyMedicine.medicine,
  )
  pharmacyMedicine: PharmacyMedicine;
}

// ####################  MedicineDetails  ####################

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

  // ******************** Details ********************

  @OneToOne(
    () => SupplierMedicineDetails,
    (supplierMedicine) => supplierMedicine.medicineDetails,
  )
  supplierMedicine: SupplierMedicineDetails;

  @OneToOne(
    () => WarehouseMedicineDetails,
    (warehouseMedicine) => warehouseMedicine.medicineDetails,
  )
  warehouseMedicine: WarehouseMedicineDetails;

  @OneToOne(
    () => InventoryMedicineDetails,
    (inventoryMedicine) => inventoryMedicine.medicineDetails,
  )
  inventoryMedicine: InventoryMedicineDetails;

  @OneToOne(
    () => PharmacyMedicineDetails,
    (pharmacyMedicine) => pharmacyMedicine.medicineDetails,
  )
  pharmacyMedicine: PharmacyMedicineDetails;

  //*********************************** Distribution ***********************************

  @OneToMany(
    () => DistributionWarehouseOrder,
    (distribution) => distribution.medicineDetails,
  )
  distribution: DistributionWarehouseOrder[];

  @OneToMany(
    () => WarehouseReturnOrderDetails,
    (warehouseDistribution) => warehouseDistribution.medicineDetails,
  )
  warehouseReturnOrderDetails: WarehouseReturnOrderDetails[];
}
