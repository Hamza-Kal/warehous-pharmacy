import { PaymentTransaction } from 'src/payment/entities/payment.entities';

export class GetByCriteriaMyPaid {
  id: number;
  userId: number;
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
    const sign = payment.firstUser.id === userId ? 1 : -1;
    this.id = payment.id;
    this.userId =
      payment.firstUser.id === userId
        ? payment.secondUser.id
        : payment.firstUser.id;
    this.paid = payment.payment * sign;
    this.total = payment.total * sign;
    this.debt = payment.debt * sign;
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
    id: number;
    userId: number;
    pharmacy: string;
    supplier: string;
    warehouse: string;
    total: number;
    paid: number;
    debt: number;
  } {
    return {
      id: this.id,
      userId: this.userId,
      pharmacy: this.pharmacy,
      supplier: this.supplier,
      warehouse: this.warehouse,
      paid: this.paid,
      debt: this.debt,
      total: this.total,
    };
  }
}
