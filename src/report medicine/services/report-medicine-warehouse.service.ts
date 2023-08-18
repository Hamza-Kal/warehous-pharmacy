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
import { IParams } from 'src/shared/interface/params.interface';
import { MedicineService } from 'src/medicine/services/medicine.service';
import { MedicineError } from 'src/medicine/services/medicine-error.service';
import {
  DeliverService,
  RepositoryEnum,
} from 'src/deliver/service/deliver.service';
import {
  InventoryReportMedicine,
  ReportMedicineStatus,
} from '../entities/report-medicine.entities';
import { ReportMedicineError } from './report-medicine-error.service';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { GetByCriteriaReportMedicine } from '../api/dto/response/get-warehouse-report-medicine.dto';

@Injectable()
export class WarehouseReportMedicineService {
  constructor(
    @InjectRepository(InventoryReportMedicine)
    private inventoryReportOrderRepository: Repository<InventoryReportMedicine>,
    private readonly medicineError: MedicineError,
    private readonly reportOrderError: ReportMedicineError,
    private medicineService: MedicineService,
    @Inject(forwardRef(() => DeliverService))
    private deliverService: DeliverService,
  ) {}

  async acceptReportOrder({ id }: IParams, user: IUser) {
    const reportOrder = await this.inventoryReportOrderRepository.findOne({
      where: {
        id,
        status: ReportMedicineStatus.Pending,
        inventory: {
          warehouse: {
            id: user.warehouseId as number,
          },
        },
      },
      relations: {
        inventory: true,

        medicineDetails: {
          medicine: true,
        },
      },
      select: {
        id: true,
        inventory: {
          id: true,
        },
        quantity: true,
        medicineDetails: {
          id: true,
          medicine: {
            id: true,
          },
        },
      },
    });
    if (!reportOrder) {
      throw new HttpException(
        this.reportOrderError.notFoundReportMedicine(),
        HttpStatus.NOT_FOUND,
      );
    }

    const inventoryId = reportOrder.inventory.id;
    const medicineDetailsIds: number[] = [],
      quantities: number[] = [],
      medicineIds = [];
    const warehouseMedicineDetails =
      await this.medicineService.findInventoryMedicineDetailsByMedicineDetails(
        reportOrder.medicineDetails.id,
      );
    if (warehouseMedicineDetails.quantity < reportOrder.quantity)
      throw new HttpException(
        this.reportOrderError.notFoundReportMedicine(),
        HttpStatus.NOT_FOUND,
      );

    const inventoryMedicine = await this.deliverService.removeMedicine(
      RepositoryEnum.InventoryMedicine,
      inventoryId,
      {
        medicineId: reportOrder.medicineDetails.medicine.id,
        quantity: reportOrder.quantity,
      },
    );
    await this.deliverService.removeMedicineDetails(
      RepositoryEnum.InventoryMedicineDetails,
      {
        medicineDetails: reportOrder.medicineDetails.id,
        medicineId: inventoryMedicine.id,
        quantity: reportOrder.quantity,
      },
    );

    const warehouseMedicine =
      await this.medicineService.findWarehouseMedicineByMedicine(
        reportOrder.medicineDetails.medicine.id,
      );

    await this.deliverService.deliverMedicineDetails(
      RepositoryEnum.WarehouseMedicineDetails,
      {
        medicineId: warehouseMedicine.id,
        medicineDetails: reportOrder.medicineDetails.id,
        quantity: reportOrder.quantity,
      },
    );

    await this.inventoryReportOrderRepository.update(
      {
        id,
        status: ReportMedicineStatus.Pending,
      },
      {
        status: ReportMedicineStatus.Accepted,
      },
    );
    return;
  }

  async rejectReportOrder({ id }: IParams, user: IUser) {
    const reportOrder = await this.inventoryReportOrderRepository.findOne({
      where: {
        id: id,
        inventory: {
          warehouse: {
            id: user.warehouseId as number,
          },
        },
        status: ReportMedicineStatus.Pending,
      },
    });

    if (!reportOrder) {
      throw new HttpException(
        this.reportOrderError.notFoundReportMedicine(),
        HttpStatus.BAD_REQUEST,
      );
    }
    reportOrder.status = ReportMedicineStatus.Rejected;
    await this.inventoryReportOrderRepository.save(reportOrder);
  }

  async findAll(
    { criteria, pagination }: { criteria: any; pagination: Pagination },
    user: IUser,
  ) {
    const { skip, limit } = pagination;
    const totalRecords = await this.inventoryReportOrderRepository.count({
      where: {
        ...criteria,
        inventory: {
          warehouse: {
            id: user.warehouseId as number,
          },
        },

        status: ReportMedicineStatus.Pending,
      },
    });

    const reports = await this.inventoryReportOrderRepository.find({
      where: {
        ...criteria,
        inventory: {
          warehouse: {
            id: user.warehouseId as number,
          },
        },
        status: ReportMedicineStatus.Pending,
      },
      select: {
        id: true,
        reason: true,
        created_at: true,
        inventory: {
          name: true,
        },
        medicineDetails: {
          id: true,
          medicine: {
            name: true,
          },
        },
      },
      relations: {
        inventory: true,
        medicineDetails: {
          medicine: true,
        },
      },
      skip,
      take: limit,
    });

    return {
      totalRecords,
      data: reports.map((report) =>
        new GetByCriteriaReportMedicine({
          reportMedicine: report,
        }).toObject(),
      ),
    };
  }
}
