import { th } from '@faker-js/faker';
import { SupplierMedicineDetails } from 'src/medicine/entities/medicine-role.entities';
import { MedicineDetails } from 'src/medicine/entities/medicine.entities';
import { OrderStatus, WarehouseOrder } from 'src/order/entities/order.entities';
import { PaymentClaim } from 'src/payment/entities/payment.entities';
import { User } from 'src/user/entities/user.entity';

export class GetPayment {
  pharmacy?: string;
  supplier?: string;
  warehouse?: string;
  total: number;
  dept: number;
  paid: number;

  constructor({
    total,
    user,
    paid,
    dept,
  }: {
    total: number;
    user: User;
    paid: number;
    dept: number;
  }) {
    this.pharmacy = user.pharmacy?.name;
    this.supplier = user.supplier?.name;
    this.warehouse = user.warehouse?.name;

    this.total = total;
    this.paid = paid;
    this.dept = dept;
  }

  toObject(): {
    pharmacy?: string;
    supplier?: string;
    warehouse?: string;
    total: number;
    dept: number;
    paid: number;
  } {
    return {
      pharmacy: this.pharmacy,
      supplier: this.supplier,
      warehouse: this.warehouse,
      paid: this.paid,
      dept: this.dept,
      total: this.total,
    };
  }
}
