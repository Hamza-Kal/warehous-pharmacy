import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IUser } from 'src/shared/interface/user.interface';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { SupplierService } from 'src/supplier/service/supplier.service';
import {
  WarehouseOrder,
  WarehouseOrderDetails,
} from '../entities/order.entities';
import { CreateWarehouseOrderDto } from '../api/dto/create-warehouse-order.dto';
import { MedicineService } from 'src/medicine/services/medicine.service';
import { MedicineError } from 'src/medicine/services/medicine-error.service';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Medicine } from 'src/medicine/entities/medicine.entities';

@Injectable()
export class WarehouseOrderService {
  constructor(
    @InjectRepository(WarehouseOrder)
    private warehouseOrderRepository: Repository<WarehouseOrder>,

    @InjectRepository(WarehouseOrderDetails)
    private warehouseOrderDetailsRepository: Repository<WarehouseOrderDetails>,
    private supplierService: SupplierService,
    private readonly medicineService: MedicineService,
    private readonly medicineError: MedicineError,
  ) {}

  async create(body: CreateWarehouseOrderDto, currUser: IUser) {
    // brute force
    const { supplierId, medicineOrder } = body;
    const medicineIds = body.medicineOrder.map(
      ({ medicineId }) => medicineId as number,
    );

    // getting the medicines with the given ids and with this supplier
    const medicines = await this.medicineService.getMedicines(
      medicineIds,
      supplierId as number,
    );

    const details: {
      price: number;
      quantity: number;
      medicine: Medicine;
    }[] = [];
    let totalPrice = 0;
    // calculating totalPrice and creating the warehouse_order_details rows
    for (let i = 0; i < medicines.length; i++) {
      details.push({
        price: medicines[i].price * medicineOrder[i].quantity,
        quantity: medicineOrder[i].quantity,
        medicine: medicineOrder[i].medicineId as Medicine,
      });
      totalPrice += medicines[i].price * medicineOrder[i].quantity;
    }

    // creating the order
    const warehouseOrder = new WarehouseOrder();
    warehouseOrder.supplier = supplierId as Supplier;
    warehouseOrder.warehouse = currUser.warehouseId as Warehouse;
    warehouseOrder.totalPrice = totalPrice;
    await this.warehouseOrderRepository.save(warehouseOrder);

    // creating the order details
    for (const detail of details) {
      const warehouseOrderDetails = new WarehouseOrderDetails();
      warehouseOrderDetails.medicine = detail.medicine;
      warehouseOrderDetails.price = detail.price;
      warehouseOrderDetails.quantity = detail.quantity;
      warehouseOrderDetails.warehouseOrder = warehouseOrder;
      await this.warehouseOrderDetailsRepository.save(warehouseOrderDetails);
    }

    // returning the order id
    return { data: { id: warehouseOrder.id } };
  }
}
