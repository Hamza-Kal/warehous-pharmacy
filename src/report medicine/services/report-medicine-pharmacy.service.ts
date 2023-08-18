import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUser } from 'src/shared/interface/user.interface';
import { SupplierService } from 'src/supplier/service/supplier.service';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { MedicineError } from 'src/medicine/services/medicine-error.service';
import {
  InventoryReportMedicine,
  PharmacyReportMedicine,
} from '../entities/report-medicine.entities';
import { ReportMedicineError } from './report-medicine-error.service';
import { GetByCriteriaReportMedicine } from '../api/dto/response/get-warehouse-report-medicine.dto';
import { CreateReportMedicineDto } from '../api/dto/create-warehouse-report-medicine.dto';
import { MedicineService } from 'src/medicine/services/medicine.service';
import { PharmacyOrderService } from 'src/order/services/order-pharmacy.service';
import { OrderService } from 'src/order/services/order.service';
import { IParams } from 'src/shared/interface/params.interface';
import { CreateReportMedicine } from '../api/dto/create-return-order.dto';

@Injectable()
export class PharmacyReportMedicineService {
  constructor(
    @InjectRepository(PharmacyReportMedicine)
    private pharmacyReportOrderRepository: Repository<PharmacyReportMedicine>,
    private readonly medicineError: MedicineError,
    private readonly medicineService: MedicineService,
    private readonly orderService: OrderService,
  ) {}

  async create(body: CreateReportMedicine, user: IUser, { id }: IParams) {
    const { batchId, quantity } = body;
    const medicineDetailsId =
      await this.medicineService.getPharmacyMedicineDetails(batchId);

    if (medicineDetailsId.quantity < quantity) {
      throw new HttpException(
        this.medicineError.notEnoughMedicine(),
        HttpStatus.BAD_REQUEST,
      );
    }
    const order = this.orderService.findMedicineDetailsOrder(
      id,
      medicineDetailsId.medicineDetails.id,
      quantity,
    );

    // //* batches can be for a different medicines so we don't need to check
    // //* to be the same medicine id for all batches
    // //? validate the order

    // if (batch.quantity > inventoryMedicineDetails.quantity) {
    //   throw new HttpException(
    //     this.medicineError.notEnoughMedicine(),
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    // const reportOrder = this.inventoryReportOrderRepository.create({
    //   created_at: new Date(),
    //   medicineDetails: inventoryMedicineDetails.medicineDetails,
    //   inventory: {
    //     id: inventoryId as number,
    //   },
    //   quantity: batch.quantity,
    //   reason: body.reason,
    // });

    // await this.inventoryReportOrderRepository.save(reportOrder);

    return {
      data: {
        // id: reportOrder.id,
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
}
