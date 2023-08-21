import { th } from '@faker-js/faker';
import { SupplierMedicineDetails } from 'src/medicine/entities/medicine-role.entities';
import { MedicineDetails } from 'src/medicine/entities/medicine.entities';
import { OrderStatus, WarehouseOrder } from 'src/order/entities/order.entities';

import { User } from 'src/user/entities/user.entity';

export class GetPayment {
  pharmacy?: string;
  supplier?: string;
  warehouse?: string;
  total: number;
  debt: number;
  paid: number;

  constructor({
    total,
    user,
    paid,
    debt,
  }: {
    total: number;
    user: User;
    paid: number;
    debt: number;
  }) {
    this.pharmacy = user.pharmacy?.name;
    this.supplier = user.supplier?.name;
    this.warehouse = user.warehouse?.name;

    this.total = total;
    this.paid = paid;
    this.debt = debt;
  }

  toObject(): {
    pharmacy?: string;
    supplier?: string;
    warehouse?: string;
    total: number;
    debt: number;
    paid: number;
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
