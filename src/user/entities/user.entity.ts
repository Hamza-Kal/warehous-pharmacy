import { Transaction } from 'sequelize';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Media } from 'src/media/entities/media.entity';
import { PaymentTransaction } from 'src/payment/entities/payment.entities';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { Role } from 'src/shared/enums/roles';
import { hashPassword } from 'src/shared/utils/bcrypt';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import {
  AfterInsert,
  AfterUpdate,
  BeforeInsert,
  BeforeRemove,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 64,
  })
  fullName: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.GUEST,
  })
  role: Role;

  @Column({
    type: 'enum',
    enum: Role,
  })
  assignedRole: Role;

  @Column({
    type: 'boolean',
    default: false,
  })
  completedAccount?: boolean;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToOne(() => Pharmacy, (pharamcy) => pharamcy.user)
  pharmacy: Pharmacy;

  @OneToOne(() => Supplier, (supplier) => supplier.user)
  supplier: Supplier;

  @OneToOne(() => Warehouse, (warehouse) => warehouse.owner)
  warehouse: Warehouse;

  @OneToOne(() => Inventory, (inventory) => inventory.manager)
  inventory: Inventory;

  @OneToMany(() => Media, (image) => image.user)
  image: Media;

  @OneToMany(() => PaymentTransaction, (transaction) => transaction.firstUser)
  outcomingPayments: PaymentTransaction[];

  @OneToMany(() => PaymentTransaction, (transaction) => transaction.secondUser)
  incomingPayments: PaymentTransaction[];

  @BeforeInsert()
  async logBeforeInsertOrUpdate() {
    this.password = await hashPassword(this.password);
  }

  @AfterInsert()
  logAfterInsert() {
    console.log('user with id %d inserted', this.id);
  }

  // @BeforeUpdate()
  // async logBeforeUpdate() {
  //   this.password = await hashPassword(this.password);
  // }

  @AfterUpdate()
  logAfterUpdate() {
    console.log('user with id %d updated', this.id);
  }

  @BeforeRemove()
  logBeforeRemove() {
    console.log('user with id %d removed', this.id);
  }
}
