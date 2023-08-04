import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, LessThan, Repository } from 'typeorm';
import { IUser } from 'src/shared/interface/user.interface';
import {
  DistributionWarehouseOrder,
  OrderStatus,
  WarehouseOrder,
} from '../entities/order.entities';
import { IParams } from 'src/shared/interface/params.interface';
import { OrderError } from './order-error.service';
import { MedicineService } from 'src/medicine/services/medicine.service';

@Injectable()
export class SupplierOrderService {
  constructor(
    @InjectRepository(WarehouseOrder)
    private warehouseOrderRepository: Repository<WarehouseOrder>,
    @InjectRepository(DistributionWarehouseOrder)
    private warehouseDistributionRepository: Repository<DistributionWarehouseOrder>,
    private medicineService: MedicineService,
    private readonly orderError: OrderError,
    private dataSource: DataSource,
  ) {}

  //? orders[0] example
  //?   {
  //?     "id": 20,
  //?     "details": [
  //?         {
  //?             "quantity": 99,
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
  async acceptOrder({ id }: IParams, user: IUser) {
    const date = new Date();
    const orders = await this.warehouseOrderRepository
      .createQueryBuilder('warehouse_order')
      .leftJoinAndSelect('warehouse_order.details', 'details')
      .leftJoinAndSelect('details.medicine', 'medicine')
      .leftJoinAndSelect('medicine.supplierMedicine', 'supplierMedicine')
      .leftJoinAndSelect(
        'medicine.medicineDetails',
        'medicineDetails',
        'medicineDetails.endDate <= :date',
        { date },
      )
      .leftJoinAndSelect(
        'medicineDetails.supplierMedicine',
        'supplierMedicineDetails',
      )
      .where('warehouse_order.id = :id', { id })
      .andWhere('warehouse_order.status = :status', {
        status: OrderStatus.Pending,
      })
      .andWhere('warehouse_order.supplierId = :supplierId', {
        supplierId: user.supplierId,
      })
      .select([
        'details.quantity',
        'medicine.id',
        'warehouse_order.id',
        'medicine.name',
        'medicineDetails.id',
        'medicineDetails.endDate',
        'supplierMedicine.id',
        'supplierMedicineDetails.quantity',
        'supplierMedicineDetails.id',
      ])
      .orderBy('medicineDetails.endDate', 'ASC')
      .getMany();

    if (!orders.length) {
      throw new HttpException(
        this.orderError.notFoundOrder(),
        HttpStatus.NOT_FOUND,
      );
    }

    const toPending = [];
    const removeMedicineDetails = [];
    //! the medicine of the order must be unique
    //! i should comment this
    //* object example is above this funcion
    for (const { quantity, medicine } of orders[0].details) {
      let wholeQuantity = quantity;
      //? If the supplier didn't create the brew in the first place then it will go here
      if (!medicine.medicineDetails.length) {
        throw new HttpException(
          this.orderError.notEnoughMedicine(),
          HttpStatus.BAD_REQUEST,
        );
      }
      for (const { supplierMedicine, id } of medicine.medicineDetails) {
        //? If the supplier deleted this brew then it will be null here
        if (!supplierMedicine) {
          throw new HttpException(
            this.orderError.notEnoughMedicine(),
            HttpStatus.BAD_REQUEST,
          );
        }
        const { quantity } = supplierMedicine;
        if (!wholeQuantity) break;
        const movedQuantity = Math.min(quantity, wholeQuantity);
        //* this array is stored in DistributedWarehouseOrder
        //* id must be the id of the medicineDetailsId
        toPending.push({
          quantity: movedQuantity,
          id,
        });
        //* this elements are removed from SupplierMedicineDetails
        removeMedicineDetails.push({
          medicineId: medicine.supplierMedicine.id,
          detailsId: supplierMedicine.id,
          quantity: movedQuantity,
        });
        wholeQuantity -= movedQuantity;
      }

      //? maybe updated to status rejected
      if (wholeQuantity) {
        throw new HttpException(
          this.orderError.notEnoughMedicine(),
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    //remove the medicines from the supplier medicines table
    for (const medicine of removeMedicineDetails) {
      await this.medicineService.moveMedicine(medicine);
    }

    // move the medicines to the pending table
    for (const medicine of toPending) {
      const distribution = this.warehouseDistributionRepository.create({
        order: orders[0],
        quantity: medicine.quantity,
        medicineDetails: medicine.id,
      });
      await this.warehouseOrderRepository.update(
        {
          id,
        },
        {
          status: OrderStatus.Accepted,
        },
      );
      await this.warehouseDistributionRepository.save(distribution);
    }

    // accept the order
    await this.warehouseOrderRepository.update(
      {
        id,
      },
      {
        status: OrderStatus.Accepted,
      },
    );
    return;
  }

  async deliveredOrder({ id }: IParams, user: IUser) {
    const order = await this.warehouseOrderRepository.update(
      {
        id,
      },
      {
        status: OrderStatus.Delivered,
      },
    );

    if (order) {
      throw new HttpException(
        this.orderError.notFoundOrder(),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
