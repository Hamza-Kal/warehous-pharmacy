import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUser } from 'src/shared/interface/user.interface';
import { SupplierService } from 'src/supplier/service/supplier.service';
import {
  WarehouseReturnOrder,
  WarehouseReturnOrderDetails,
} from '../entities/returnOrder.entities';
import { CreateWarehouseReturnOrderDto } from '../api/dto/create-warehouse-returnOrder.dto';
import { MedicineService } from 'src/medicine/services/medicine.service';
import { GetAllWarehouseReturnOrder } from '../api/dto/response/get-warehouse-returnOrder.dto';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { IParams } from 'src/shared/interface/params.interface';
import { ReturnOrderError } from './returnOrder-error.service';
import { GetByIdWarehouseReturnOrder } from '../api/dto/response/get-by-id-warehouse-returnOrder.dto';
import { WarehouseMedicineDetails } from 'src/medicine/entities/medicine-role.entities';
import { In } from 'typeorm/find-options/operator/In';
import { SupplierError } from 'src/supplier/service/supplier-error.service';
import { MedicineError } from 'src/medicine/services/medicine-error.service';

@Injectable()
export class WarehouseReturnOrderService {
  constructor(
    @InjectRepository(WarehouseReturnOrder)
    private warehouseReturnOrderRepository: Repository<WarehouseReturnOrder>,

    @InjectRepository(WarehouseReturnOrderDetails)
    private warehouseReturnOrderDetailsRepository: Repository<WarehouseReturnOrderDetails>,
    private supplierService: SupplierService,
    private readonly medicineError: MedicineError,
    private readonly returnOrderError: ReturnOrderError,
    private SupplierError: SupplierError,
    @InjectRepository(WarehouseMedicineDetails)
    private warehouseMedicineDetailsRepository: Repository<WarehouseMedicineDetails>,
  ) {}

  async create(body: CreateWarehouseReturnOrderDto, owner: IUser) {
    const { warehouseId } = owner;
    const { batches, returnReason } = body;

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
          supplierLastPrice: true,
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
    const supplierId =
      warehouseMedicineDetails[0].medicine.medicine.supplier.id;

    let totalOrderPrice = 0;
    //* batches can be for a different medicines so we don't need to check
    //* to be the same medicine id for all batches
    //? validate the order
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

      if (
        supplierId !== warehouseMedicineDetail.medicine.medicine.supplier.id
      ) {
        throw new HttpException(
          this.SupplierError.notFoundSupplier(),
          HttpStatus.NOT_FOUND,
        );
      }

      totalOrderPrice +=
        warehouseMedicineDetail.supplierLastPrice * toBeReturnedQuantity;
    }

    const returnOrder = this.warehouseReturnOrderRepository.create({
      medicine: warehouseMedicineDetails[0].medicine.medicine,
      supplier: {
        id: supplierId,
      },
      reason: returnReason,
      created_at: new Date(),
      warehouse: {
        id: warehouseId as number,
      },
      totalPrice: totalOrderPrice,
    });
    await this.warehouseReturnOrderRepository.save(returnOrder);

    for (const warehouseMedicineDetail of warehouseMedicineDetails) {
      const toBeReturnedQuantity = batchQuantity.get(
        warehouseMedicineDetail.id,
      );
      const warehouseReturnOrderDetail =
        this.warehouseReturnOrderDetailsRepository.create({
          medicineDetails: warehouseMedicineDetail.medicineDetails,
          quantity: toBeReturnedQuantity,
          price: warehouseMedicineDetail.supplierLastPrice,
          warehouseReturnOrder: returnOrder,
        });
      await this.warehouseReturnOrderDetailsRepository.save(
        warehouseReturnOrderDetail,
      );
    }
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
