import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

//* not important

@Entity()
export class PaymentTransaction {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ManyToOne(() => User, (user) => user.outcomingPayments)
  @JoinColumn()
  firstUser: User;

  @ManyToOne(() => User, (user) => user.incomingPayments)
  @JoinColumn()
  secondUser: User;

  @Column({ type: 'int', default: 0 })
  total: number;

  @Column({ type: 'int', default: 0 })
  debt: number;

  @Column({ type: 'int', default: 0 })
  payment: number;

  @OneToMany(() => TransactionDetails, (details) => details.transaction)
  details: TransactionDetails[];
}

export enum TransactionStatus {
  paid = 'Paid',
  debt = 'debt',
}
@Entity()
export class TransactionDetails {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ManyToOne(() => PaymentTransaction, (transaction) => transaction.details)
  @JoinColumn()
  transaction: PaymentTransaction;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.paid,
  })
  status: TransactionStatus;

  @Column({ type: Date, default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'int', default: 0 })
  amount: number;
}
