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

// ####################  WarehouseMedicine  ####################
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

// ####################  WarehouseMedicinePrice  ####################
@Entity()
export class WarehouseMedicinePrice {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'int',
  })
  price: number;

  @ManyToOne(() => Medicine, (medicine) => medicine.warehouseMedicinePrice)
  @JoinColumn()
  medicine: Medicine;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.medicinePrice)
  @JoinColumn()
  warehouse: Warehouse;
}

// ####################  PharmacyMedicinePrice  ####################
@Entity()
export class PharmacyMedicinePrice {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'int',
  })
  price: number;

  @ManyToOne(() => Pharmacy, (pharmacy) => pharmacy.medicinePrice)
  @JoinColumn()
  pharmacy: Pharmacy;

  @ManyToOne(() => Medicine, (medicine) => medicine.pharmacyMedicinePrice)
  @JoinColumn()
  medicine: Medicine;
}

// ####################  PharmacyMedicine  ####################
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

// ####################  InventoryMedicine  ####################
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
