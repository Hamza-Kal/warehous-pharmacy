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
import {
  WarehouseMedicine,
  WarehouseMedicineDetails,
} from 'src/medicine/entities/medicine-role.entities';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { or } from 'sequelize';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { GetByCriteraOrder } from '../api/dto/response/get-by-criteria-order.dto';
import {
  DeliverService,
  RepositoryEnum,
} from 'src/deliver/service/deliver.service';
import { PaymentService } from 'src/payment/services/payment.service';
import { GetWarehouseSupplierOrderDetails } from '../api/dto/response/get-by-id-supplier-warehouse-order.dto';

@Injectable()
export class SupplierOrderService {
  constructor(
    @InjectRepository(WarehouseOrder)
    private warehouseOrderRepository: Repository<WarehouseOrder>,
    @InjectRepository(DistributionWarehouseOrder)
    private warehouseDistributionRepository: Repository<DistributionWarehouseOrder>,
    private medicineService: MedicineService,
    private readonly orderError: OrderError,
    private deliverService: DeliverService,
    private paymentService: PaymentService,
  ) {}

  async findAll(
    { pagination, criteria }: { pagination: Pagination; criteria?: any },
    user: IUser,
  ) {
    const { skip, limit } = pagination;
    const { supplierId } = user;
    const totalRecords = await this.warehouseOrderRepository.count({
      where: {
        ...criteria,
        supplier: {
          id: supplierId as number,
        },
      },
    });
    const orders = await this.warehouseOrderRepository.find({
      where: {
        ...criteria,
        supplier: {
          id: supplierId as number,
        },
      },
      relations: {
        supplier: true,
        warehouse: true,
      },
      select: {
        id: true,
        status: true,
        created_at: true,
        warehouse: {
          name: true,
        },
        totalPrice: true,
      },
      skip,
      take: limit,
    });
    return {
      totalRecords,
      data: orders.map((order) => new GetByCriteraOrder({ order }).toObject()),
    };
  }

  async findOne(user: IUser, { id }: IParams) {
    const [order] = await this.warehouseOrderRepository.find({
      where: {
        id,
        supplier: {
          id: user.supplierId as number,
        },
      },
      select: {
        status: true,
        id: true,
        created_at: true,
        warehouse: {
          name: true,
          phoneNumber: true,
          location: true,
        },
        details: {
          quantity: true,
          medicine: {
            name: true,
          },
          price: true,
        },
        totalPrice: true,
      },
      relations: {
        warehouse: true,
        details: {
          medicine: true,
        },
      },
    });

    if (!order) {
      throw new HttpException(
        this.orderError.notFoundOrder,
        HttpStatus.NOT_FOUND,
      );
    }
    return { data: new GetWarehouseSupplierOrderDetails({ order }).toObject() };
  }

  //? orders[0] example
  //?   {
  //?     "id": 20,
  //?     "details": [
  //?         {
  //?             "quantity": 99,
  //?             "price": 247500,
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
        'medicineDetails.endDate >= :date',
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
        'details.price',
        'medicine.id',
        'warehouse_order.id',
        'medicine.name',
        'medicineDetails.id',
        'medicineDetails.endDate',
        'supplierMedicine.id',
        'supplierMedicine.quantity',
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
    const removeMedicineDetails: {
      medicineId: number;
      detailsId: number;
      quantity: number;
    }[] = [];
    //! the medicine of the order must be unique
    //! i should comment this
    //* object example is above this function
    for (const detail of orders[0].details) {
      const { quantity, medicine, price } = detail;
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

        if (!wholeQuantity) break;
        const movedQuantity = Math.min(quantity, wholeQuantity);

        //* this array is stored in DistributedWarehouseOrder
        //* id must be the id of the medicineDetailsId
        toPending.push({
          quantity: movedQuantity,
          id,
          price,
        });
        //* this elements are removed from SupplierMedicineDetails

        removeMedicineDetails.push({
          medicineId: medicine.id,
          detailsId: id,
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
      const supplierMedicine = await this.deliverService.removeMedicine(
        RepositoryEnum.SupplierMedicine,
        user.supplierId as number,
        { medicineId: medicine.medicineId, quantity: medicine.quantity },
      );

      await this.deliverService.removeMedicineDetails(
        RepositoryEnum.SupplierMedicineDetails,
        {
          medicineId: supplierMedicine.id,
          quantity: medicine.quantity,
          medicineDetails: medicine.detailsId,
        },
      );
    }

    // move the medicines to the pending table
    for (const medicine of toPending) {
      const distribution = this.warehouseDistributionRepository.create({
        order: orders[0],
        quantity: medicine.quantity,
        medicineDetails: medicine.id,
        price: medicine.price,
      });

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
    const order = await this.warehouseOrderRepository.findOne({
      where: {
        id,
        supplier: {
          id: user.supplierId as number,
        },
        status: OrderStatus.Accepted,
      },
      relations: {
        warehouse: {
          owner: true,
        },
        supplier: true,
      },
      select: {
        id: true,
        supplier: {
          id: true,
        },
        totalPrice: true,
        warehouse: {
          id: true,
          owner: {
            id: true,
          },
        },
        status: true,
      },
    });

    if (!order) {
      throw new HttpException(
        this.orderError.notFoundOrder(),
        HttpStatus.BAD_REQUEST,
      );
    }

    order.status = OrderStatus.Delivered;

    const distributions = await this.warehouseDistributionRepository.find({
      where: { order: { id } },
      relations: {
        medicineDetails: {
          medicine: true,
        },
      },
      select: {
        quantity: true,
        price: true,
        medicineDetails: {
          id: true,
          medicine: {
            id: true,
          },
        },
      },
    });

    if (!distributions.length) {
      throw new HttpException(
        this.orderError.notFoundDistributionError,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const medicineId = new Set<number>();
    const medicineQuantity = new Map<number, number>();

    for (const distribution of distributions) {
      const { medicineDetails } = distribution;
      const { medicine } = medicineDetails;

      if (!medicineId.has(medicine.id)) {
        medicineQuantity.set(medicine.id, distribution.quantity);
        medicineId.add(medicine.id);
        continue;
      }

      let quantity = medicineQuantity.get(medicine.id);
      quantity += distribution.quantity;
      medicineQuantity.set(medicine.id, quantity);
    }

    //* Create the medicine to the warehouseMedicine table
    for (const id of medicineId) {
      let medicine = await this.medicineService.findWarehouseMedicineByMedicine(
        id,
      );
      const quantity = medicineQuantity.get(id);
      if (!medicine) {
        medicine = await this.medicineService.createWarehouseMedicine({
          medicine: id,
          warehouse: order.warehouse.id,
        });
      }

      await this.medicineService.updateQuantity(
        medicine.id,
        quantity + medicine.quantity,
      );
    }

    //* Create medicine details for warehouseMedicineDetails table
    for (const distribution of distributions) {
      let medicineDetails =
        await this.medicineService.findWarehouseMedicineDetailsByMedicineDetails(
          distribution.medicineDetails.id,
        );

      const { medicine } = distribution.medicineDetails;
      const warehouseMedicine =
        await this.medicineService.findWarehouseMedicineByMedicine(medicine.id);
      if (!medicineDetails) {
        medicineDetails =
          await this.medicineService.createWarehouseMedicineDetails({
            medicine: warehouseMedicine as WarehouseMedicine,
            medicineDetails: distribution.medicineDetails.id as number,
          });
      }
      await this.medicineService.updateQuantityDetails(
        medicineDetails.id,
        medicineDetails.quantity + distribution.quantity,
        distribution.price,
      );
    }
    await this.paymentService.createDept(
      order.warehouse.owner.id,
      user.id,
      order.totalPrice,
    );

    await this.warehouseOrderRepository.save(order);

    return;
  }

  async rejectOrder({ id }: IParams, user: IUser) {
    const order = await this.warehouseOrderRepository.findOne({
      where: [
        {
          id: id,
          supplier: {
            id: user.supplierId as number,
          },
          status: OrderStatus.Pending,
        },
      ],
    });

    if (!order) {
      throw new HttpException(
        this.orderError.notFoundOrder(),
        HttpStatus.BAD_REQUEST,
      );
    }
    order.status = OrderStatus.Rejected;
    await this.warehouseOrderRepository.save(order);
  }
}
