import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
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
  medicineDetails: MedicineDetails;
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

  @Column({
    type: 'int',
  })
  price: number;

  @OneToOne(
    () => MedicineDetails,
    (medicineDetails) => medicineDetails.warehouseMedicine,
  )
  medicineDetails: MedicineDetails;

  @ManyToOne(() => Supplier, (supplier) => supplier.supplierMedicine, {
    onDelete: 'CASCADE',
  })
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

  @Column({
    type: 'int',
  })
  price: number;

  @OneToOne(
    () => MedicineDetails,
    (medicineDetails) => medicineDetails.warehouseMedicine,
  )
  medicineDetails: MedicineDetails;

  @ManyToOne(() => Pharmacy, (pharmacy) => pharmacy.pharmacyMedicines)
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

  @Column({
    type: 'int',
  })
  price: number;

  @OneToOne(
    () => MedicineDetails,
    (medicineDetails) => medicineDetails.warehouseMedicine,
  )
  medicineDetails: MedicineDetails;
}
