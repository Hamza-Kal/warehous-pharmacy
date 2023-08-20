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
import {
  DeliverService,
  RepositoryEnum,
} from 'src/deliver/service/deliver.service';
import { Role } from 'src/shared/enums/roles';
import { report } from 'process';
import { GetByCriteriaPharmacyReportMedicine } from '../api/dto/response/get-by-criteria-pharmacy-report-order.dto';

@Injectable()
export class PharmacyReportMedicineService {
  constructor(
    @InjectRepository(PharmacyReportMedicine)
    private pharmacyReportOrderRepository: Repository<PharmacyReportMedicine>,
    private readonly medicineError: MedicineError,
    private readonly medicineService: MedicineService,
    private readonly orderService: OrderService,
    private readonly deliverService: DeliverService,
  ) {}

  async create(body: CreateReportMedicine, user: IUser, { id }: IParams) {
    // id is order id
    const { batchId, quantity } = body;
    const medicineDetailsId =
      await this.medicineService.getPharmacyMedicineDetails(batchId, user);

    if (medicineDetailsId.quantity < quantity) {
      throw new HttpException(
        this.medicineError.notEnoughMedicine(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const order = await this.orderService.findMedicineDetailsOrder(
      id,
      medicineDetailsId.medicineDetails.id,
      quantity,
      user,
    );

    // //* batches can be for a different medicines so we don't need to check
    // //* to be the same medicine id for all batches
    // //? validate the order
    const medicine = await this.deliverService.removeMedicine(
      RepositoryEnum.PharmacyMedicine,
      user.pharmacyId as number,
      {
        medicineId: medicineDetailsId.medicineDetails.medicine.id,
        quantity,
      },
    );

    await this.deliverService.removeMedicineDetails(
      RepositoryEnum.PharmacyMedicineDetails,
      {
        medicineDetails: medicineDetailsId.medicineDetails.id,
        medicineId: medicine.id,
        quantity,
      },
    );
    const reportOrder = this.pharmacyReportOrderRepository.create({
      created_at: new Date(),
      medicineDetails: medicineDetailsId.medicineDetails,
      pharmacy: {
        id: user.pharmacyId as number,
      },
      quantity,
      reason: body.reason,
      order,
      price: order.details[0].price * quantity,
    });

    await this.pharmacyReportOrderRepository.save(reportOrder);

    return {
      data: {
        id: reportOrder.id,
      },
    };
  }

  async findAll(
    { pagination, criteria }: { pagination: Pagination; criteria: any },
    user: IUser,
  ) {
    const { limit, skip } = pagination;
    const totalRecords = await this.pharmacyReportOrderRepository.count({
      where: {
        pharmacy: {
          id: user.pharmacyId as number,
        },
      },
    });
    const reportOrders = await this.pharmacyReportOrderRepository.find({
      where: {
        pharmacy: {
          id: user.pharmacyId as number,
        },
      },
      select: {
        id: true,
        reason: true,
        created_at: true,
        status: true,
        quantity: true,
        medicineDetails: {
          medicine: {
            id: true,
          },
          endDate: true,
        },
        order: {
          warehouse: {
            name: true,
            location: true,
            phoneNumber: true,
          },
        },
      },
      relations: {
        order: {
          warehouse: true,
        },
        medicineDetails: {
          medicine: true,
        },
      },
      skip,
      take: limit,
    });

    // return reportOrders;

    return {
      totalRecords,
      data: reportOrders.map((reportMedicine) =>
        new GetByCriteriaPharmacyReportMedicine({ reportMedicine }).toObject(),
      ),
    };
  }
}
