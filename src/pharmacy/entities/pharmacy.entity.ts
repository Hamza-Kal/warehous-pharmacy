import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { PharmacyMedicine } from 'src/medicine/entities/medicine-role.entities';
import {
  PharmacyFastOrder,
  PharmacyOrder,
} from 'src/order/entities/order.entities';
import { PharmacyReportMedicine } from 'src/report medicine/entities/report-medicine.entities';
import {
  PharmacyComplaint,
  WarehouseComplaint,
} from 'src/complaint/entities/role-complaint.entities';

@Entity()
export class Pharmacy {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

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
  location: string;

  @Column({
    type: 'varchar',
    length: 15,
  })
  phoneNumber: string;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToOne(() => User, (user) => user.pharmacy, { cascade: true })
  @JoinColumn()
  user: User;

  @OneToMany(
    () => PharmacyMedicine,
    (pharmacyMedicines) => pharmacyMedicines.pharmacy,
  )
  medicines: PharmacyMedicine[];

  //******************** Orders ********************

  @OneToMany(() => PharmacyOrder, (pharmacyOrder) => pharmacyOrder.pharmacy)
  pharmacyOrder: PharmacyOrder[];

  @OneToMany(() => PharmacyFastOrder, (pharmacyOrder) => pharmacyOrder.pharmacy)
  pharmacyFastOrder: PharmacyOrder[];

  @OneToMany(
    () => PharmacyReportMedicine,
    (pharmacyOrder) => pharmacyOrder.pharmacy,
    {
      onDelete: 'CASCADE',
    },
  )
  returnOrder: PharmacyReportMedicine[];

  // ********************** Complaints ****************** //

  @OneToMany(() => PharmacyComplaint, (complaint) => complaint.pharmacy)
  complaints: PharmacyComplaint[];

  @OneToMany(
    () => WarehouseComplaint,
    (complaint) => complaint.complaintedPharmacy,
  )
  recievedComplaints: WarehouseComplaint[];
}
