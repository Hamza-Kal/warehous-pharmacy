import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Warehouse {
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
  phone_number: string;

  @ManyToOne(() => User, (user) => user.warehouses)
  user: User;
}
