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
  DistributionPharmacyOrder,
  DistributionWarehouseOrder,
  PharmacyOrderDetails,
  WarehouseOrderDetails,
} from 'src/order/entities/order.entities';
import {
  WarehouseReturnOrder,
  WarehouseReturnOrderDetails,
} from 'src/return order/entities/returnOrder.entities';
import { InventoryReportMedicine } from 'src/report medicine/entities/report-medicine.entities';
import { Media } from 'src/media/entities/media.entity';

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

  @OneToOne(() => Media, (image) => image.medicine)
  @JoinColumn()
  image: Media;

  @ManyToOne(() => Supplier, (supplier) => supplier.medicine, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  supplier: Supplier;

  //******************** Details ********************

  @OneToMany(
    () => MedicineDetails,
    (medicineDetails) => medicineDetails.medicine,
    {
      cascade: true,
    },
  )
  medicineDetails: MedicineDetails[];

  //******************** Order ********************

  @OneToMany(
    () => WarehouseOrderDetails,
    (warehouseOrderDetails) => warehouseOrderDetails.medicine,
    {
      cascade: true,
    },
  )
  warehouseOrderDetails: WarehouseOrderDetails[];

  @OneToMany(
    () => PharmacyOrderDetails,
    (pharmacyOrderDetails) => pharmacyOrderDetails.medicine,
    {
      cascade: true,
    },
  )
  pharmacyOrderDetails: PharmacyOrderDetails[];

  //******************** Roles ********************

  @OneToOne(
    () => SupplierMedicine,
    (supplierMedicine) => supplierMedicine.medicine,
  )
  supplierMedicine: SupplierMedicine;

  @OneToMany(
    () => WarehouseMedicine,
    (warehouseMedicine) => warehouseMedicine.medicine,
    {
      cascade: true,
    },
  )
  warehouseMedicine: WarehouseMedicine[];

  @OneToMany(
    () => InventoryMedicine,
    (inventoryMedicine) => inventoryMedicine.medicine,
    {
      cascade: true,
    },
  )
  inventoryMedicine: InventoryMedicine[];

  @OneToMany(
    () => PharmacyMedicine,
    (pharmacyMedicine) => pharmacyMedicine.medicine,
    {
      cascade: true,
    },
  )
  pharmacyMedicine: PharmacyMedicine[];

  //******************** Return Medicine ********************/

  @OneToMany(
    () => WarehouseReturnOrder,
    (warehouseReturnOrder) => warehouseReturnOrder.medicine,
    {
      cascade: true,
    },
  )
  warehouseReturnOrder: WarehouseReturnOrder[];
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

  @OneToMany(
    () => SupplierMedicineDetails,
    (supplierMedicine) => supplierMedicine.medicineDetails,
    {
      cascade: true,
    },
  )
  supplierMedicine: SupplierMedicineDetails[];

  @OneToMany(
    () => WarehouseMedicineDetails,
    (warehouseMedicine) => warehouseMedicine.medicineDetails,
    {
      cascade: true,
    },
  )
  warehouseMedicine: WarehouseMedicineDetails[];

  @OneToMany(
    () => InventoryMedicineDetails,
    (inventoryMedicine) => inventoryMedicine.medicineDetails,
    {
      cascade: true,
    },
  )
  inventoryMedicine: InventoryMedicineDetails[];

  @OneToMany(
    () => PharmacyMedicineDetails,
    (pharmacyMedicine) => pharmacyMedicine.medicineDetails,
    {
      cascade: true,
    },
  )
  pharmacyMedicine: PharmacyMedicineDetails[];

  //*********************************** Distribution ***********************************

  @OneToMany(
    () => DistributionWarehouseOrder,
    (distribution) => distribution.medicineDetails,
    {
      cascade: true,
    },
  )
  distribution: DistributionWarehouseOrder[];

  @OneToMany(
    () => DistributionPharmacyOrder,
    (distribution) => distribution.medicineDetails,
    {
      cascade: true,
    },
  )
  distributionPharmacy: DistributionPharmacyOrder[];

  @OneToMany(
    () => WarehouseReturnOrderDetails,
    (warehouseDistribution) => warehouseDistribution.medicineDetails,
    {
      cascade: true,
    },
  )
  warehouseReturnOrderDetails: WarehouseReturnOrderDetails[];

  @OneToMany(
    () => InventoryReportMedicine,
    (inventoryReportMedicineDetails) =>
      inventoryReportMedicineDetails.medicineDetails,
    {
      cascade: true,
    },
  )
  inventoryReportMedicineDetails: InventoryReportMedicine[];
}
