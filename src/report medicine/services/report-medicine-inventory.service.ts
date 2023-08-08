import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUser } from 'src/shared/interface/user.interface';
import { SupplierService } from 'src/supplier/service/supplier.service';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { InventoryMedicineDetails } from 'src/medicine/entities/medicine-role.entities';
import { In } from 'typeorm/find-options/operator/In';
import { MedicineError } from 'src/medicine/services/medicine-error.service';
import {
  InventoryReportMedicine,
  InventoryReportMedicineDetails,
} from '../entities/report-medicine.entities';
import { ReportMedicineError } from './report-medicine-error.service';
import { GetByCriteraReportMedicine } from '../api/dto/response/get-warehouse-report-medicine.dto';
import { CreateReportMedicineDto } from '../api/dto/create-warehouse-report-medicine.dto';

@Injectable()
export class InventoryReportMedicineService {
  constructor(
    @InjectRepository(InventoryReportMedicine)
    private inventoryReportOrderRepository: Repository<InventoryReportMedicine>,

    @InjectRepository(InventoryReportMedicineDetails)
    private inventoryReportOrderDetailsRepository: Repository<InventoryReportMedicineDetails>,
    private supplierService: SupplierService,
    private readonly medicineError: MedicineError,
    private readonly reportOrderError: ReportMedicineError,
    @InjectRepository(InventoryMedicineDetails)
    private inventoryMedicineDetailsRepository: Repository<InventoryMedicineDetails>,
  ) {}

  async create(body: CreateReportMedicineDto, owner: IUser) {
    const { inventoyId } = owner;
    const { batches } = body;

    const batchQuantity = new Map<number, number>();
    const batchesIds = [];
    for (const batch of batches) {
      batchesIds.push(batch.batchId);
      batchQuantity.set(batch.batchId, batch.quantity);
    }

    const inventoryMedicineDetails =
      await this.inventoryMedicineDetailsRepository.find({
        where: {
          id: In(batchesIds),
          medicine: {
            inventory: {
              id: inventoyId as number,
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
    if (inventoryMedicineDetails.length !== batchesIds.length)
      throw new HttpException(
        this.medicineError.notFoundMedicine(),
        HttpStatus.NOT_FOUND,
      );

    //* batches can be for a different medicines so we don't need to check
    //* to be the same medicine id for all batches
    //? validate the order
    for (const warehouseMedicineDetail of inventoryMedicineDetails) {
      const toBeReturnedQuantity = batchQuantity.get(
        warehouseMedicineDetail.id,
      );
      if (toBeReturnedQuantity > warehouseMedicineDetail.quantity) {
        throw new HttpException(
          this.medicineError.notEnoughMedicine(),
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const reportOrder = this.inventoryReportOrderRepository.create({
      // medicine: inventoryMedicineDetails[0].medicine.medicine,

      created_at: new Date(),
      inventory: {
        id: inventoyId as number,
      },
    });
    await this.inventoryMedicineDetailsRepository.save(reportOrder);

    for (const inventoryMedicineDetail of inventoryMedicineDetails) {
      const toBeReturnedQuantity = batchQuantity.get(
        inventoryMedicineDetail.id,
      );
      const inventoryReportOrderDetail =
        this.inventoryReportOrderDetailsRepository.create({
          medicineDetails: inventoryMedicineDetail.medicineDetails,
          quantity: toBeReturnedQuantity,
          InventoryReportMedicine: reportOrder,
        });
      await this.inventoryReportOrderDetailsRepository.save(
        inventoryReportOrderDetail,
      );
    }
    return {
      data: {
        id: reportOrder.id,
      },
    };
  }

  // async findOne({ id }: IParams, user: IUser) {
  //   const reportOrder = await this.warehouseReportOrderRepository.findOne({
  //     where: {
  //       id,
  //     },
  //     select: {
  //       id: true,
  //       details: {
  //         quantity: true,
  //         // medicine: {
  //         //   name: true,
  //         // },
  //       },
  //     },
  //     relations: {
  //       details: {
  //         // medicine: true,
  //       },
  //     },
  //   });

  //   if (!reportOrder) {
  //     throw new HttpException(
  //       this.reportOrderError.notFoundReportMedicine(),
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  //   return {
  //     // data: new GetByIdWarehouseReportOrder({ reportOrder }).toObject(),
  //   };
  // }

  async findAll(
    { pagination, criteria }: { pagination: Pagination; criteria?: any },
    user: IUser,
  ) {
    const { skip, limit } = pagination;
    const { warehouseId } = user;
    const totalRecords = await this.inventoryReportOrderRepository.count({
      where: {
        ...criteria,
        warehouse: {
          id: warehouseId as number,
        },
      },
    });
    const reportOrders = await this.inventoryReportOrderRepository.find({
      where: {
        ...criteria,
        warehouse: {
          id: warehouseId as number,
        },
      },
      select: {
        id: true,
        status: true,
        created_at: true,
      },
      skip,
      take: limit,
    });
    return {
      totalRecords,
      data: reportOrders.map((reportOrder) =>
        new GetByCriteraReportMedicine({
          reportMedicine: reportOrder,
        }).toObject(),
      ),
    };
  }
}
