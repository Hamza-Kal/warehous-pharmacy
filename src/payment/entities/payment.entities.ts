import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PaymentAccount {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @OneToOne(() => User, (user) => user.payment)
  user: User;

  @Column({ type: 'int', default: '0' })
  balance: number;
}

@Entity()
export class PaymentTransaction {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ManyToOne(() => User, (user) => user.outcomingPayments)
  sender: User;

  @ManyToOne(() => User, (user) => user.incomingPayments)
  receiver: User;

  @Column({ type: 'int', default: 0 })
  amount: number;

  @OneToMany(() => TransactionDetails, (details) => details.transaction)
  details: TransactionDetails[];
}

@Entity()
export class TransactionDetails {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ManyToOne(() => PaymentTransaction, (transaction) => transaction.details)
  transaction: PaymentTransaction;

  @Column({ type: Date, default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'int', default: 0 })
  amount: number;
}
