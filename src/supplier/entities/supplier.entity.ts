import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { SupplierMedicine } from 'src/medicine/entities/medicine-role.entities';

@Entity()
export class Supplier {
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

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(
    () => SupplierMedicine,
    (supplierMedicine) => supplierMedicine.supplier,
  )
  supplierMedicine: SupplierMedicine;
}
