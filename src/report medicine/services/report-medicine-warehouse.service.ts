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
import {
  WarehouseMedicine,
  WarehouseMedicineDetails,
} from 'src/medicine/entities/medicine-role.entities';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { or } from 'sequelize';
import { OrderStatus } from 'src/order/entities/order.entities';
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
    private dataSource: DataSource,
  ) {}

  async acceptReportOrder({ id }: IParams, user: IUser) {
    const reportOrderRepo = await this.inventoryReportOrderRepository.find({
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
        details: {
          medicineDetails: {
            medicine: true,
          },
        },
      },
      select: {
        id: true,
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

    if (!reportOrderRepo.length) {
      throw new HttpException(
        this.reportOrderError.notFoundReportMedicine(),
        HttpStatus.NOT_FOUND,
      );
    }
    const reportOrder = reportOrderRepo[0];
    const inventoryId = reportOrder.inventory.id;
    const medicineDetailsIds: number[] = [],
      quantities: number[] = [],
      medicineIds = [];
    for (const { quantity, medicineDetails } of reportOrder.details) {
      const warehouseMedicineDetails =
        await this.medicineService.findWarehouseMedicineDetailsByMedicineDetails(
          medicineDetails.id,
        );
      if (warehouseMedicineDetails.quantity < quantity)
        throw new HttpException(
          this.reportOrderError.notFoundReportMedicine(),
          HttpStatus.NOT_FOUND,
        );
      quantities.push(quantity);
      medicineIds.push(medicineDetails.medicine.id);
      medicineDetailsIds.push(medicineDetails.id);
    }

    for (let i = 0; i < medicineDetailsIds.length; ++i) {
      const inventoryMedicine = await this.deliverService.removeMedicine(
        RepositoryEnum.InventoryMedicine,
        inventoryId,
        { medicineId: medicineIds[i], quantity: quantities[i] },
      );
      await this.deliverService.removeMedicineDetails(
        RepositoryEnum.InventoryMedicineDetails,
        {
          medicineDetails: medicineDetailsIds[i],
          medicineId: inventoryMedicine.id,
          quantity: quantities[i],
        },
      );

      const warehouseMedicine = await this.deliverService.deliverMedicine(
        RepositoryEnum.WarehouseMedicine,
        user.supplierId as number,
        { medicineId: medicineIds[i], quantity: quantities[i] },
      );

      await this.deliverService.deliverMedicineDetails(
        RepositoryEnum.WarehouseMedicineDetails,
        {
          medicineId: warehouseMedicine.id,
          medicineDetails: medicineDetailsIds[i],
          quantity: quantities[i],
        },
      );
    }
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
}
