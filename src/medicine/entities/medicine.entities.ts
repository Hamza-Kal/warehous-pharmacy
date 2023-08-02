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
  PharmacyMedicinePrice,
  WarehouseMedicine,
  WarehouseMedicinePrice,
} from './medicine-role.entities';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { WarehouseOrderDetails } from 'src/order/entities/order.entities';

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
  id?: number;

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
    type: 'int',
  })
  price: number;

  @Column({
    type: 'int',
    default: 0,
  })
  quantity?: number;

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

  @OneToMany(
    () => MedicineDetails,
    (medicineDetails) => medicineDetails.medicine,
  )
  medicineDetails: MedicineDetails[];

  @OneToMany(
    () => WarehouseMedicinePrice,
    (warehouseMedicinePrice) => warehouseMedicinePrice.medicine,
  )
  warehouseMedicinePrice: WarehouseMedicinePrice;

  @OneToMany(
    () => PharmacyMedicinePrice,
    (pharmacyMedicinePrice) => pharmacyMedicinePrice.medicine,
  )
  pharmacyMedicinePrice: PharmacyMedicinePrice;

  @OneToMany(
    () => WarehouseOrderDetails,
    (warehouseOrderDetails) => warehouseOrderDetails.medicine,
    { onDelete: 'CASCADE' },
  )
  warehoueOrderDetails: WarehouseOrderDetails[];
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

  @Column({
    type: 'int',
    default: 0,
  })
  quantity: number;

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
}
