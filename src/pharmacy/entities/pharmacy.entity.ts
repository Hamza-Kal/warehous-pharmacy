import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import {
  PharmacyMedicine,
  PharmacyMedicinePrice,
} from 'src/medicine/entities/medicine-role.entities';

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

  @OneToOne(() => User, (user) => user.pharmacy, { cascade: true })
  @JoinColumn()
  user: User;

  @OneToMany(
    () => PharmacyMedicine,
    (pharmacyMedicines) => pharmacyMedicines.pharmacy,
    { onDelete: 'CASCADE' },
  )
  pharmacyMedicines: PharmacyMedicine[];

  @OneToMany(
    () => PharmacyMedicinePrice,
    (medicinePrice) => medicinePrice.pharmacy,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  medicinePrice: PharmacyMedicinePrice[];
}
