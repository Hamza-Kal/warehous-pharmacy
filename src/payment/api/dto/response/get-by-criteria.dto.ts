import { PaymentTransaction } from 'src/payment/entities/payment.entities';

export class GetByCriteriaMyPaid {
  pharmacy: string;
  supplier: string;
  warehouse: string;
  total: number;
  paid: number;
  debt: number;
  constructor({
    payment,
    userId,
  }: {
    payment: PaymentTransaction;
    userId: number;
  }) {
    this.paid = payment.payment;
    this.total = payment.total;
    this.debt = payment.debt;
    this.warehouse =
      userId !== payment.firstUser.id
        ? payment.firstUser.warehouse?.name
        : payment.secondUser.warehouse?.name;
    this.supplier =
      userId !== payment.firstUser.id
        ? payment.firstUser.supplier?.name
        : payment.secondUser.supplier?.name;
    this.pharmacy =
      userId !== payment.firstUser.id
        ? payment.firstUser.pharmacy?.name
        : payment.secondUser.pharmacy?.name;
  }

  toObject(): {
    pharmacy: string;
    supplier: string;
    warehouse: string;
    total: number;
    paid: number;
    debt: number;
  } {
    return {
      pharmacy: this.pharmacy,
      supplier: this.supplier,
      warehouse: this.warehouse,
      paid: this.paid,
      debt: this.debt,
      total: this.total,
    };
  }
}
