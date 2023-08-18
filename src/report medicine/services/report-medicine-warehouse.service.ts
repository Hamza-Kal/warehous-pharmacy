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
  PharmacyReportMedicine,
  ReportMedicineStatus,
} from '../entities/report-medicine.entities';
import { ReportMedicineError } from './report-medicine-error.service';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { GetByCriteriaReportMedicine } from '../api/dto/response/get-warehouse-report-medicine.dto';
import { GetByCriteriaPharmacyReportMedicine } from '../api/dto/response/get-by-criteria-pharmacy-report-order.dto';
import { GetByCriteriaPharmacyReportMedicineWarehouse } from '../api/dto/response/get-all-warehouse-pharmacy-report-medicine.dto';

@Injectable()
export class WarehouseReportMedicineService {
  constructor(
    @InjectRepository(InventoryReportMedicine)
    private inventoryReportOrderRepository: Repository<InventoryReportMedicine>,
    @InjectRepository(PharmacyReportMedicine)
    private pharmacyReportOrderRepository: Repository<PharmacyReportMedicine>,
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

  async acceptPharmacyReportOrder({ id }: IParams, user: IUser) {
    const reportOrder = await this.pharmacyReportOrderRepository.findOne({
      where: {
        id,
        status: ReportMedicineStatus.Pending,
        order: {
          warehouse: {
            id: user.warehouseId as number,
          },
        },
      },
      relations: {
        order: true,
        medicineDetails: {
          medicine: true,
        },
      },
      select: {
        id: true,

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

    const warehouseMedicine =
      await this.medicineService.findWarehouseMedicineByMedicine(
        reportOrder.medicineDetails.medicine.id,
      );

    await this.deliverService.deliverMedicine(
      RepositoryEnum.WarehouseMedicine,
      user.warehouseId as number,
      {
        medicineId: warehouseMedicine.id,
        quantity: reportOrder.quantity,
      },
    );
    await this.deliverService.deliverMedicineDetails(
      RepositoryEnum.WarehouseMedicineDetails,
      {
        medicineId: warehouseMedicine.id,
        medicineDetails: reportOrder.medicineDetails.id,
        quantity: reportOrder.quantity,
      },
    );

    await this.pharmacyReportOrderRepository.update(
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

  async rejectPharmacyReportOrder({ id }: IParams, user: IUser) {
    const reportOrder = await this.pharmacyReportOrderRepository.findOne({
      where: {
        id: id,
        order: {
          warehouse: {
            id: user.warehouseId as number,
          },
        },
        status: ReportMedicineStatus.Pending,
      },
      select: {
        quantity: true,
        pharmacy: {
          id: true,
        },
        id: true,
        medicineDetails: {
          id: true,
          medicine: {
            id: true,
          },
        },
      },
      relations: {
        pharmacy: true,
        medicineDetails: {
          medicine: true,
        },
      },
    });

    if (!reportOrder) {
      throw new HttpException(
        this.reportOrderError.notFoundReportMedicine(),
        HttpStatus.BAD_REQUEST,
      );
    }

    reportOrder.status = ReportMedicineStatus.Rejected;
    const pharmacyMedicine = await this.deliverService.deliverMedicine(
      RepositoryEnum.PharmacyMedicine,
      reportOrder.pharmacy.id,
      {
        medicineId: reportOrder.medicineDetails.medicine.id,
        quantity: reportOrder.quantity,
      },
    );

    await this.deliverService.deliverMedicineDetails(
      RepositoryEnum.PharmacyMedicineDetails,
      {
        medicineDetails: reportOrder.medicineDetails.id,
        medicineId: pharmacyMedicine.id,
        quantity: reportOrder.quantity,
      },
    );
    await this.pharmacyReportOrderRepository.save(reportOrder);
    return;
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
  async findAllPharmacy(
    { criteria, pagination }: { criteria: any; pagination: Pagination },
    user: IUser,
  ) {
    const { skip, limit } = pagination;
    const totalRecords = await this.pharmacyReportOrderRepository.count({
      where: {
        ...criteria,

        order: {
          warehouse: {
            id: user.warehouseId as number,
          },
        },
      },
    });

    const reports = await this.pharmacyReportOrderRepository.find({
      where: {
        ...criteria,

        order: {
          warehouse: {
            id: user.warehouseId as number,
          },
        },
      },
      select: {
        id: true,
        reason: true,
        created_at: true,
        status: true,
        pharmacy: {
          name: true,
          location: true,
          phoneNumber: true,
          user: {
            email: true,
          },
        },
        medicineDetails: {
          id: true,
          medicine: {
            name: true,
            image: {
              url: true,
            },
          },
        },
      },
      relations: {
        pharmacy: {
          user: true,
        },
        medicineDetails: {
          medicine: {
            image: true,
          },
        },
      },
      skip,
      take: limit,
    });

    return {
      totalRecords,
      data: reports.map((report) =>
        new GetByCriteriaPharmacyReportMedicineWarehouse({
          reportMedicine: report,
        }).toObject(),
      ),
    };
  }
}
