import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IUser } from 'src/shared/interface/user.interface';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { SupplierService } from 'src/supplier/service/supplier.service';
import {
  PharmacyOrder,
  PharmacyOrderDetails,
  WarehouseOrder,
  WarehouseOrderDetails,
} from '../entities/order.entities';
import {
  CreatePharmacyOrderDto,
  CreateWarehouseOrderDto,
} from '../api/dto/create-warehouse-order.dto';
import { MedicineService } from 'src/medicine/services/medicine.service';
import { MedicineError } from 'src/medicine/services/medicine-error.service';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Medicine } from 'src/medicine/entities/medicine.entities';
import { GetAllWarehouseOrder } from '../api/dto/response/get-warehouse-order.dto';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { IParams } from 'src/shared/interface/params.interface';
import { OrderError } from './order-error.service';
import { GetByIdWarehouseOrder } from '../api/dto/response/get-by-id-warehouse-order.dto';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';

@Injectable()
export class PharmacyOrderService {
  constructor(
    @InjectRepository(PharmacyOrder)
    private pharmacyOrderRepository: Repository<PharmacyOrder>,

    @InjectRepository(PharmacyOrderDetails)
    private pharmacyOrderDetailsRepository: Repository<PharmacyOrderDetails>,
    private supplierService: SupplierService,
    private readonly medicineService: MedicineService,
    private readonly orderError: OrderError,
  ) {}

  async create(body: CreatePharmacyOrderDto, currUser: IUser) {
    // brute force
    const { warehouseId, medicineOrder } = body;
    const medicineIds = body.medicineOrder.map(
      ({ medicineId }) => medicineId as number,
    );
    // getting the medicines with the given ids and with this supplier
    const medicines = await this.medicineService.getWarehouseMedicines(
      medicineIds,
      warehouseId as number,
    );

    const details: {
      price: number;
      quantity: number;
      medicine: Medicine | number;
    }[] = [];
    let totalPrice = 0;
    // calculating totalPrice and creating the warehouse_order_details rows
    for (let i = 0; i < medicines.length; i++) {
      details.push({
        price: medicines[i].price,
        quantity: medicineOrder[i].quantity,
        medicine: medicines[i].medicine.id,
      });
      totalPrice += medicines[i].price * medicineOrder[i].quantity;
    }

    // creating the order
    const pharmacyOrder = new PharmacyOrder();
    pharmacyOrder.warehouse = warehouseId as Warehouse;
    pharmacyOrder.pharmacy = currUser.pharmacyId as Pharmacy;
    pharmacyOrder.totalPrice = totalPrice;

    await this.pharmacyOrderRepository.save(pharmacyOrder);
    // creating the order details
    for (const detail of details) {
      const pharmacyOrderDetails = new PharmacyOrderDetails();
      pharmacyOrderDetails.medicine = detail.medicine as Medicine;
      pharmacyOrderDetails.price = detail.price;
      pharmacyOrderDetails.quantity = detail.quantity;
      pharmacyOrderDetails.pharmacyOrder = pharmacyOrder;
      await this.pharmacyOrderDetailsRepository.save(pharmacyOrderDetails);
    }

    // returning the order id
    return { data: { id: pharmacyOrder.id } };
  }

  //   async findOne({ id }: IParams, user: IUser) {
  //     const order = await this.warehouseOrderRepository.findOne({
  //       where: {
  //         id,
  //         warehouse: {
  //           id: user.warehouseId as number,
  //         },
  //       },
  //       select: {
  //         id: true,
  //         supplier: {
  //           id: true,
  //           name: true,
  //           phoneNumber: true,
  //           location: true,
  //           user: {
  //             email: true,
  //           },
  //         },
  //         details: {
  //           quantity: true,
  //           price: true,
  //           medicine: {
  //             name: true,
  //           },
  //         },
  //       },
  //       relations: {
  //         supplier: {
  //           user: true,
  //         },
  //         details: {
  //           medicine: true,
  //         },
  //       },
  //     });

  //     if (!order) {
  //       throw new HttpException(
  //         this.orderError.notFoundOrder(),
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }
  //     return {
  //       data: new GetByIdWarehouseOrder({ order }).toObject(),
  //     };
  //   }

  //   async findAll(
  //     { pagination, criteria }: { pagination: Pagination; criteria?: any },
  //     user: IUser,
  //   ) {
  //     const { skip, limit } = pagination;
  //     const { warehouseId } = user;
  //     const totalRecords = await this.warehouseOrderRepository.count({
  //       where: {
  //         ...criteria,
  //         warehouse: {
  //           id: warehouseId as number,
  //         },
  //       },
  //     });
  //     const orders = await this.warehouseOrderRepository.find({
  //       where: {
  //         ...criteria,
  //         warehouse: {
  //           id: warehouseId as number,
  //         },
  //       },
  //       relations: {
  //         supplier: true,
  //       },
  //       select: {
  //         id: true,
  //         status: true,
  //         created_at: true,
  //         supplier: {
  //           name: true,
  //         },
  //         totalPrice: true,
  //       },
  //       skip,
  //       take: limit,
  //     });
  //     return {
  //       totalRecords,
  //       data: orders.map((order) =>
  //         new GetAllWarehouseOrder({ order }).toObject(),
  //       ),
  //     };
  //   }
}
