import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUser } from 'src/shared/interface/user.interface';
import { SupplierService } from 'src/supplier/service/supplier.service';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { MedicineError } from 'src/medicine/services/medicine-error.service';
import { InventoryReportMedicine } from '../entities/report-medicine.entities';
import { ReportMedicineError } from './report-medicine-error.service';
import { GetByCriteraReportMedicine } from '../api/dto/response/get-warehouse-report-medicine.dto';
import { CreateReportMedicineDto } from '../api/dto/create-warehouse-report-medicine.dto';
import { MedicineService } from 'src/medicine/services/medicine.service';

@Injectable()
export class InventoryReportMedicineService {
  constructor(
    @InjectRepository(InventoryReportMedicine)
    private inventoryReportOrderRepository: Repository<InventoryReportMedicine>,

    private supplierService: SupplierService,
    private readonly medicineError: MedicineError,
    private readonly reportOrderError: ReportMedicineError,
    private medicineService: MedicineService,
  ) {}

  async create(body: CreateReportMedicineDto, owner: IUser) {
    const { inventoryId } = owner;
    const { batch } = body;

    const inventoryMedicineDetails =
      await this.medicineService.findInventoryMedicineDetails(
        batch.batchId,
        inventoryId as number,
      );
    if (!inventoryMedicineDetails)
      throw new HttpException(
        this.medicineError.notFoundMedicine(),
        HttpStatus.NOT_FOUND,
      );

    //* batches can be for a different medicines so we don't need to check
    //* to be the same medicine id for all batches
    //? validate the order

    if (batch.quantity > inventoryMedicineDetails.quantity) {
      throw new HttpException(
        this.medicineError.notEnoughMedicine(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const reportOrder = this.inventoryReportOrderRepository.create({
      created_at: new Date(),
      medicineDetails: inventoryMedicineDetails.medicineDetails,
      inventory: {
        id: inventoryId as number,
      },
      quantity: batch.quantity,
      reason: body.reason,
    });

    console.log(body.reason);

    await this.inventoryReportOrderRepository.save(reportOrder);

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
