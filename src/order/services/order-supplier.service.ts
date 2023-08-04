import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, LessThan, MoreThan, Repository } from 'typeorm';
import { IUser } from 'src/shared/interface/user.interface';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { SupplierService } from 'src/supplier/service/supplier.service';
import {
  OrderStatus,
  WarehouseOrder,
  WarehouseOrderDetails,
} from '../entities/order.entities';
import { CreateWarehouseOrderDto } from '../api/dto/create-warehouse-order.dto';
import { MedicineService } from 'src/medicine/services/medicine.service';
import { MedicineError } from 'src/medicine/services/medicine-error.service';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Medicine } from 'src/medicine/entities/medicine.entities';
import { AccepOrderDto } from '../api/dto/accept-warehouse-order.dto';
import { IParams } from 'src/shared/interface/params.interface';

@Injectable()
export class SupplierOrderService {
  constructor(
    @InjectRepository(WarehouseOrder)
    private warehouseOrderRepository: Repository<WarehouseOrder>,
    @InjectRepository(WarehouseOrderDetails)
    private warehouseOrderDetailsRepository: Repository<WarehouseOrderDetails>,
    private supplierService: SupplierService,
    private readonly medicineService: MedicineService,
    private readonly medicineError: MedicineError,
  ) {}

  async acceptOrder({ id }: IParams, user: IUser) {
    const date = new Date();
    const order = await this.warehouseOrderRepository.findOne({
      where: {
        id,
        supplier: { id: user.supplierId as number },
        status: OrderStatus.Pending,
        details: {
          medicine: {
            medicineDetails: {
              endDate: LessThan(date),
            },
          },
        },
      },
      relations: {
        details: {
          medicine: {
            medicineDetails: true,
          },
        },
      },
      select: {
        details: {
          quantity: true,
          price: true,
          medicine: {
            id: true,
            quantity: true,
            medicineDetails: {
              endDate: true,
            },
          },
        },
      },
    });

    // for (const { quantity, medicine } of order.details) {
    // }
    return order;
  }
}
