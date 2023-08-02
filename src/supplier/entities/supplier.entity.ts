import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Medicine } from 'src/medicine/entities/medicine.entities';
import { WarehouseOrder } from 'src/order/entities/order.entities';

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

  @OneToOne(() => User, (user) => user.supplier, { cascade: true })
  @JoinColumn()
  user: User;

  @OneToMany(() => Medicine, (medicine) => medicine.supplier)
  medicine: Medicine[];

  @OneToMany(() => WarehouseOrder, (order) => order.supplier)
  warehouseOrder: WarehouseOrder[];
}
