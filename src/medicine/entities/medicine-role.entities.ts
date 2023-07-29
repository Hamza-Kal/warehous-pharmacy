import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { MedicineDetails } from './medicine.entities';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';

@Entity()
export class WarehouseMedicine {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'int',
  })
  quantity: number;

  @Column({
    type: 'int',
  })
  price: number;

  @OneToOne(
    () => MedicineDetails,
    (medicineDetails) => medicineDetails.warehouseMedicine,
  )
  @JoinColumn()
  medicineDetails: MedicineDetails;
}

@Entity()
export class SupplierMedicinePrice {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'int',
  })
  price: number;
}
@Entity()
export class SupplierMedicine {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'int',
  })
  quantity: number;

  @OneToOne(
    () => MedicineDetails,
    (medicineDetails) => medicineDetails.warehouseMedicine,
  )
  @JoinColumn()
  medicineDetails: MedicineDetails;

  @ManyToOne(() => Supplier, (supplier) => supplier.supplierMedicine)
  supplier: Supplier;
}
@Entity()
export class PharmacyMedicine {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'int',
  })
  quantity: number;

  @OneToOne(
    () => MedicineDetails,
    (medicineDetails) => medicineDetails.warehouseMedicine,
  )
  @JoinColumn()
  medicineDetails: MedicineDetails;

  @ManyToOne(() => Pharmacy, (pharmacy) => pharmacy.pharmacyMedicines)
  @JoinColumn()
  pharmacy: Pharmacy;
}
@Entity()
export class InventoryMedicine {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'int',
  })
  quantity: number;

  @OneToOne(
    () => MedicineDetails,
    (medicineDetails) => medicineDetails.warehouseMedicine,
  )
  @JoinColumn()
  medicineDetails: MedicineDetails;
}
