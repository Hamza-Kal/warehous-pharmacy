import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, LessThan, Repository } from 'typeorm';
import { IUser } from 'src/shared/interface/user.interface';
import {
  ReturnOrderStatus,
  WarehouseReturnOrder,
} from '../entities/returnOrder.entities';
import { IParams } from 'src/shared/interface/params.interface';
import { MedicineService } from 'src/medicine/services/medicine.service';
import {
  WarehouseMedicine,
  WarehouseMedicineDetails,
} from 'src/medicine/entities/medicine-role.entities';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { or } from 'sequelize';
import { ReturnOrderError } from './returnOrder-error.service';
import { OrderStatus } from 'src/order/entities/order.entities';
import { MedicineError } from 'src/medicine/services/medicine-error.service';
import {
  DeliverService,
  RepositoryEnum,
} from 'src/deliver/service/deliver.service';

@Injectable()
export class SupplierReturnOrderService {
  constructor(
    @InjectRepository(WarehouseReturnOrder)
    private warehouseReturnOrderRepository: Repository<WarehouseReturnOrder>,
    private readonly medicineError: MedicineError,
    private readonly returnOrderError: ReturnOrderError,
    private medicineService: MedicineService,
    @Inject(forwardRef(() => DeliverService))
    private deliverService: DeliverService,
    private dataSource: DataSource,
  ) {}

  //? returnOrders[0] example
  //?   {
  //?     "id": 20,
  //?     "details": [
  //?         {
  //?             "quantity": 99,
  //?             "price": 247500,
  //?             "medicine": {
  //?                 "id": 15,
  //?                 "name": "vitamen c",
  //?                 "supplierMedicine": {
  //?                     "id": 23
  //?                 },
  //?                 "medicineDetails": [
  //?                     {
  //?                         "id": 32,
  //?                         "endDate": "2023-05-02",
  //?                         "supplierMedicine": {
  //?                             id: 8,
  //?                             "quantity": 2401
  //?                         }
  //?                     }
  //?                 ]
  //?             }
  //?         }
  //?     ]
  //? }
  async acceptReturnOrder({ id }: IParams, user: IUser) {
    const returnOrderRepo = await this.warehouseReturnOrderRepository.find({
      where: {
        id,
        supplier: {
          id: user.supplierId as number,
        },
        status: ReturnOrderStatus.Pending,
      },
      relations: {
        warehouse: true,
        details: {
          medicineDetails: {
            medicine: true,
          },
        },
      },
      select: {
        warehouse: {
          id: true,
        },
        id: true,
        totalPrice: true,
        details: {
          quantity: true,
          medicineDetails: {
            id: true,
            medicine: {
              id: true,
            },
          },
        },
      },
    });

    if (!returnOrderRepo.length) {
      throw new HttpException(
        this.returnOrderError.notFoundReturnOrder(),
        HttpStatus.NOT_FOUND,
      );
    }
    const returnOrder = returnOrderRepo[0];
    const warehoouseId = returnOrder.warehouse.id;
    const medicineDetailsIds: number[] = [],
      quantities: number[] = [],
      medicineIds = [];
    for (const { quantity, medicineDetails } of returnOrder.details) {
      const warehouseMedicineDetails =
        await this.medicineService.findWarehouseMedicineDetailsByMedicineDetails(
          medicineDetails.id,
        );
      if (warehouseMedicineDetails.quantity < quantity)
        throw new HttpException(
          this.returnOrderError.notFoundReturnOrder(),
          HttpStatus.NOT_FOUND,
        );
      quantities.push(quantity);
      medicineIds.push(medicineDetails.medicine.id);
      medicineDetailsIds.push(medicineDetails.id);
    }

    for (let i = 0; i < medicineDetailsIds.length; ++i) {
      const warehouseMedicine = await this.deliverService.removeMedicine(
        RepositoryEnum.WarehouseMedicine,
        warehoouseId,
        { medicineId: medicineIds[i], quantity: quantities[i] },
      );
      await this.deliverService.removeMedicineDetails(
        RepositoryEnum.WarehouseMedicineDetails,
        {
          medicineDetails: medicineDetailsIds[i],
          medicineId: warehouseMedicine.id,
          quantity: quantities[i],
        },
      );

      const supplierMedicine = await this.deliverService.deliverMedicine(
        RepositoryEnum.SupplierMedicine,
        user.supplierId as number,
        { medicineId: medicineIds[i], quantity: quantities[i] },
      );

      await this.deliverService.deliverMedicineDetails(
        RepositoryEnum.SupplierMedicineDetails,
        {
          medicineId: supplierMedicine.id,
          medicineDetails: medicineDetailsIds[i],
          quantity: quantities[i],
        },
      );
    }
    await this.warehouseReturnOrderRepository.update(
      {
        id,
        supplier: {
          id: user.supplierId as number,
        },
        status: ReturnOrderStatus.Pending,
      },
      {
        status: ReturnOrderStatus.Accepted,
      },
    );
    return;
  }

  async rejectReturnOrder({ id }: IParams, user: IUser) {
    const returnOrder = await this.warehouseReturnOrderRepository.findOne({
      where: {
        id: id,
        supplier: {
          id: user.supplierId as number,
        },
        status: ReturnOrderStatus.Pending,
      },
    });

    if (!returnOrder) {
      throw new HttpException(
        this.returnOrderError.notFoundReturnOrder(),
        HttpStatus.BAD_REQUEST,
      );
    }
    returnOrder.status = ReturnOrderStatus.Rejected;
    await this.warehouseReturnOrderRepository.save(returnOrder);
  }
}
