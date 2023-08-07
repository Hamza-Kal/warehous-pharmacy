import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IUser } from 'src/shared/interface/user.interface';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { SupplierService } from 'src/supplier/service/supplier.service';
import {
  WarehouseReturnOrder,
  WarehouseReturnOrderDetails,
} from '../entities/returnOrder.entities';
import { CreateWarehouseReturnOrderDto } from '../api/dto/create-warehouse-returnOrder.dto';
import { MedicineService } from 'src/medicine/services/medicine.service';
import { MedicineError } from 'src/medicine/services/medicine-error.service';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Medicine } from 'src/medicine/entities/medicine.entities';
import { GetAllWarehouseReturnOrder } from '../api/dto/response/get-warehouse-returnOrder.dto';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { IParams } from 'src/shared/interface/params.interface';
import { ReturnOrderError } from './returnOrder-error.service';
import { GetByIdWarehouseReturnOrder } from '../api/dto/response/get-by-id-warehouse-returnOrder.dto';
import { WarehouseMedicineDetails } from 'src/medicine/entities/medicine-role.entities';
import { In } from 'typeorm/find-options/operator/In';
import { WarehouseOrderDetails } from 'src/order/entities/order.entities';

@Injectable()
export class WarehouseReturnOrderService {
  medicineError: any;
  constructor(
    @InjectRepository(WarehouseReturnOrder)
    private warehouseReturnOrderRepository: Repository<WarehouseReturnOrder>,

    @InjectRepository(WarehouseReturnOrderDetails)
    private warehouseReturnOrderDetailsRepository: Repository<WarehouseReturnOrderDetails>,
    private supplierService: SupplierService,
    private readonly medicineService: MedicineService,
    private readonly returnOrderError: ReturnOrderError,
    @InjectRepository(WarehouseMedicineDetails)
    private warehouseMedicineDetailsRepository: Repository<WarehouseMedicineDetails>,
  ) {}

  async create(body: CreateWarehouseReturnOrderDto, owner: IUser) {
    const { warehouseId } = owner;
    const { batches } = body;

    const batchQuantity = new Map<number, number>();
    const batchesIds = [];
    for (const batch of batches) {
      batchesIds.push(batch.batchId);
      batchQuantity.set(batch.batchId, batch.quantity);
    }

    const warehouseMedicineDetails =
      await this.warehouseMedicineDetailsRepository.find({
        where: {
          id: In(batchesIds),
          medicine: {
            warehouse: {
              id: warehouseId as number,
            },
          },
        },
        relations: {
          medicine: {
            medicine: {
              supplier: true,
            },
          },
          medicineDetails: true,
        },
        select: {
          medicine: {
            id: true,
            medicine: { id: true },
          },
          id: true,
          quantity: true,
          medicineDetails: {
            id: true,
          },
        },
      });
    if (warehouseMedicineDetails.length !== batchesIds.length)
      throw new HttpException(
        this.medicineError.notFoundMedicine(),
        HttpStatus.NOT_FOUND,
      );
    const supplier = warehouseMedicineDetails[0].medicine.medicine.supplier;

    const toAddwarehouseReturnOrdDetails = [];

    // batches can be for a different medicines so we don't need to check
    // to be the same medicine id for all batches
    let totalOrderPrice = 0;
    for (const warehouseMedicineDetail of warehouseMedicineDetails) {
      const toBeReturnedQuantity = batchQuantity.get(
        warehouseMedicineDetail.id,
      );
      if (toBeReturnedQuantity > warehouseMedicineDetail.quantity) {
        throw new HttpException(
          this.medicineError.notEnoughMedicine(),
          HttpStatus.BAD_REQUEST,
        );
      }
      const warehouseReturnOrderDetail =
        this.warehouseReturnOrderDetailsRepository.create({
          medicineDetails: warehouseMedicineDetail.medicineDetails,
          quantity: toBeReturnedQuantity,
          price:
            toBeReturnedQuantity * warehouseMedicineDetail.supplierLastPrice,
        });
      totalOrderPrice += warehouseReturnOrderDetail.price;
      await this.warehouseReturnOrderDetailsRepository.save(
        warehouseMedicineDetail,
      );
      toAddwarehouseReturnOrdDetails.push(warehouseReturnOrderDetail);
    }
    const returnOrder = this.warehouseReturnOrderRepository.create({
      medicine: warehouseMedicineDetails[0].medicine.medicine,
      supplier,
      created_at: new Date(),
      warehouse: {
        id: warehouseId as number,
      },
      details: toAddwarehouseReturnOrdDetails,
      totalPrice: totalOrderPrice,
    });
    await this.warehouseReturnOrderRepository.save(returnOrder);
    return {
      data: {
        id: returnOrder.id,
      },
    };
  }

  async findOne({ id }: IParams, user: IUser) {
    const returnOrder = await this.warehouseReturnOrderRepository.findOne({
      where: {
        id,
        warehouse: {
          id: user.warehouseId as number,
        },
      },
      select: {
        id: true,
        supplier: {
          id: true,
          name: true,
          phoneNumber: true,
          location: true,
          user: {
            email: true,
          },
        },
        details: {
          quantity: true,
          price: true,
          // medicine: {
          //   name: true,
          // },
        },
      },
      relations: {
        supplier: {
          user: true,
        },
        details: {
          // medicine: true,
        },
      },
    });

    if (!returnOrder) {
      throw new HttpException(
        this.returnOrderError.notFoundReturnOrder(),
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      data: new GetByIdWarehouseReturnOrder({ returnOrder }).toObject(),
    };
  }

  async findAll(
    { pagination, criteria }: { pagination: Pagination; criteria?: any },
    user: IUser,
  ) {
    const { skip, limit } = pagination;
    const { warehouseId } = user;
    const totalRecords = await this.warehouseReturnOrderRepository.count({
      where: {
        ...criteria,
        warehouse: {
          id: warehouseId as number,
        },
      },
    });
    const returnOrders = await this.warehouseReturnOrderRepository.find({
      where: {
        ...criteria,
        warehouse: {
          id: warehouseId as number,
        },
      },
      relations: {
        supplier: true,
      },
      select: {
        id: true,
        status: true,
        created_at: true,
        supplier: {
          name: true,
        },
        totalPrice: true,
      },
      skip,
      take: limit,
    });
    return {
      totalRecords,
      data: returnOrders.map((returnOrder) =>
        new GetAllWarehouseReturnOrder({ returnOrder }).toObject(),
      ),
    };
  }
}
