import { de, th } from '@faker-js/faker';
import { SupplierMedicineDetails } from 'src/medicine/entities/medicine-role.entities';
import { MedicineDetails } from 'src/medicine/entities/medicine.entities';
import { OrderStatus, WarehouseOrder } from 'src/order/entities/order.entities';
import { TransactionDetails } from 'src/payment/entities/payment.entities';
import { User } from 'src/user/entities/user.entity';

export class GetByCriteriaMyPaidDetails {
  date: Date;
  amount: number;

  constructor({ detail }: { detail: TransactionDetails }) {
    this.date = detail.date;
    this.amount = detail.amount;
  }

  toObject(): { date: Date; amount: number } {
    return {
      date: this.date,
      amount: this.amount,
    };
  }
}
