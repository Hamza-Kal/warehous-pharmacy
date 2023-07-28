import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { PharmacyOrders } from 'src/order/entities/order.entities';
import { PharmacyMedicine } from 'src/medicine/entities/medicine-role.entities';

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

  @OneToOne(() => User, { cascade: true })
  @JoinColumn()
  user: User;

  @OneToMany(
    () => PharmacyOrders,
    (pharmacyOrders) => pharmacyOrders.pharmacy,
    { onDelete: 'CASCADE' },
  )
  pharmacyOrder: PharmacyOrders[];

  @OneToMany(
    () => PharmacyMedicine,
    (pharmacyMedicines) => pharmacyMedicines.pharmacy,
    { onDelete: 'CASCADE' },
  )
  pharmacyMedicines: PharmacyMedicine[];
}
