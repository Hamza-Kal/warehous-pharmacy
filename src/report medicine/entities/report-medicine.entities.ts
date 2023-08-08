import { Inventory } from 'src/inventory/entities/inventory.entity';
import {
  Medicine,
  MedicineDetails,
} from 'src/medicine/entities/medicine.entities';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ReportMedicineStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
}

@Entity()
export class InventoryReportMedicine {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'enum',
    enum: ReportMedicineStatus,
    default: ReportMedicineStatus.Pending,
  })
  status: ReportMedicineStatus;

  @ManyToOne(
    () => Inventory,
    (inventory) => inventory.inventoryReportMedicine,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  inventory: Inventory;

  @OneToMany(
    () => InventoryReportMedicineDetails,
    (InventoryReportMedicineDetails) =>
      InventoryReportMedicineDetails.InventoryReportMedicine,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  details: InventoryReportMedicineDetails[];
}

@Entity()
export class InventoryReportMedicineDetails {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @ManyToOne(
    () => InventoryReportMedicine,
    (InventoryReportMedicine) => InventoryReportMedicine.details,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  InventoryReportMedicine: InventoryReportMedicine;

  @ManyToOne(
    () => MedicineDetails,
    (medicineDetails) => medicineDetails.inventoryReportMedicineDetails,
  )
  @JoinColumn()
  medicineDetails: MedicineDetails;

  @Column({
    type: 'int',
  })
  quantity: number;
}
