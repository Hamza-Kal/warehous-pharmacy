import {
  PaymentTransaction,
  TransactionDetails,
} from 'src/payment/entities/payment.entities';

export class GetByCriteriaToPaidDetails {
  amount: number;
  date: Date;
  constructor({ detail }: { detail: TransactionDetails }) {
    this.amount = Math.abs(detail.amount);
    this.date = detail.date;
  }

  toObject(): {
    amount: number;
    date: Date;
  } {
    return {
      amount: this.amount,
      date: this.date,
    };
  }
}
