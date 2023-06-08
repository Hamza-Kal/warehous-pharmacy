import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Role } from 'src/enums/roles';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 64,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 64,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 64,
  })
  fullName: string;

  @Column({
    type: 'varchar',
    length: 64,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
  })
  @OneToMany(() => Warehouse, (warehouse) => warehouse.user)
  warehouses: Warehouse[];

  @AfterInsert()
  logInsert() {
    console.log('user with id %d created', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('user with id %d updated', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('user with id %d removed', this.id);
  }
}
