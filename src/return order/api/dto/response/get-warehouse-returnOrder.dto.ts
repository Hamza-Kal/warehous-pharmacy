import {
  ReturnOrderStatus,
  WarehouseReturnOrder,
} from 'src/return order/entities/returnOrder.entities';

export class GetAllWarehouseReturnOrder {
  id: number;
  returnOrderDate: Date;
  supplierName: string;
  status: ReturnOrderStatus;
  totalPrice: number;
  constructor({ returnOrder }: { returnOrder: WarehouseReturnOrder }) {
    this.id = returnOrder.id;
    this.returnOrderDate = returnOrder.created_at;
    this.supplierName = returnOrder.supplier.name;
    this.status = returnOrder.status;
    this.totalPrice = returnOrder.totalPrice;
  }

  toObject(): {
    id: number;
    returnOrderDate: Date;
    supplierName: string;
    status: ReturnOrderStatus;
    totalPrice: number;
  } {
    return {
      id: this.id,
      supplierName: this.supplierName,
      returnOrderDate: this.returnOrderDate,
      status: this.status,
      totalPrice: this.totalPrice,
    };
  }
}
