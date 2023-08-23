import {
  ReturnOrderStatus,
  WarehouseReturnOrder,
} from 'src/return order/entities/returnOrder.entities';

export class GetWarehouseReturnOrdersForSupplierDto {
  id: number;
  returnOrderDate: Date;
  warehouse: { name: string };
  // warehouseName: string;
  status: ReturnOrderStatus;
  reason: string;
  totalPrice: number;
  medicineName: string;
  batches: {
    id: number;
    quantity: number;
    price: number;
  }[];
  constructor({ returnOrder }: { returnOrder: WarehouseReturnOrder }) {
    this.id = returnOrder.id;
    this.returnOrderDate = returnOrder.created_at;
    this.warehouse = returnOrder.warehouse;
    this.status = returnOrder.status;
    this.totalPrice = returnOrder.totalPrice;
    this.medicineName = returnOrder.medicine.name;
    this.reason = returnOrder.reason;
    const toAddBatches = [];
    for (const batch of returnOrder.details) {
      const toAddBatch: any = {};
      Object.assign(toAddBatch, batch);
      toAddBatches.push(toAddBatch);
    }
    this.batches = toAddBatches;
  }

  toObject(): {
    id: number;
    returnOrderDate: Date;
    warehouse: { name: string };
    status: ReturnOrderStatus;
    totalPrice: number;
    reason: string;
    medicineName: string;
    batches: {
      id: number;
      quantity: number;
      price: number;
    }[];
  } {
    return {
      id: this.id,
      warehouse: this.warehouse,
      returnOrderDate: this.returnOrderDate,
      status: this.status,
      reason: this.reason,
      totalPrice: this.totalPrice,
      medicineName: this.medicineName,
      batches: this.batches,
    };
  }
}
