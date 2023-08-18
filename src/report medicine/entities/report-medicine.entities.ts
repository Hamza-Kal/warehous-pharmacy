import { Inventory } from 'src/inventory/entities/inventory.entity';
import { MedicineDetails } from 'src/medicine/entities/medicine.entities';
import { PharmacyOrder } from 'src/order/entities/order.entities';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToOne,
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

  //********************  Details  ********************/
  @Column({
    type: 'int',
  })
  quantity: number;

  @Column({ type: 'varchar', length: 255 })
  reason: string;

  @ManyToOne(
    () => MedicineDetails,
    (medicineDetails) => medicineDetails.inventoryReportMedicineDetails,
  )
  @JoinColumn()
  medicineDetails: MedicineDetails;
}

@Entity()
export class PharmacyReportMedicine {
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

  @Column()
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => PharmacyOrder, (pharmacyOrder) => pharmacyOrder.report)
  @JoinColumn()
  order: PharmacyOrder;

  @ManyToOne(() => Pharmacy, (pharmacy) => pharmacy.returnOrder, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  pharmacy: Pharmacy;

  //********************  Details  ********************/
  @Column({
    type: 'int',
  })
  quantity: number;

  @Column({ type: 'varchar', length: 255 })
  reason: string;

  @ManyToOne(
    () => MedicineDetails,
    (medicineDetails) => medicineDetails.inventoryReportMedicineDetails,
  )
  @JoinColumn()
  medicineDetails: MedicineDetails;
}
