import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IUser } from 'src/shared/interface/user.interface';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { SupplierService } from 'src/supplier/service/supplier.service';
import {
  WarehouseReturnOrder,
  WarehouseReturnOrderDetails,
} from '../entities/returnOrder.entities';
import { CreateWarehouseReturnOrderDto } from '../api/dto/create-warehouse-returnOrder.dto';
import { MedicineService } from 'src/medicine/services/medicine.service';
import { MedicineError } from 'src/medicine/services/medicine-error.service';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Medicine } from 'src/medicine/entities/medicine.entities';
import { GetAllWarehouseReturnOrder } from '../api/dto/response/get-warehouse-returnOrder.dto';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { IParams } from 'src/shared/interface/params.interface';
import { ReturnOrderError } from './returnOrder-error.service';
import { GetByIdWarehouseReturnOrder } from '../api/dto/response/get-by-id-warehouse-returnOrder.dto';

@Injectable()
export class WarehouseReturnOrderService {
  constructor(
    @InjectRepository(WarehouseReturnOrder)
    private warehouseReturnOrderRepository: Repository<WarehouseReturnOrder>,

    @InjectRepository(WarehouseReturnOrderDetails)
    private warehouseReturnOrderDetailsRepository: Repository<WarehouseReturnOrderDetails>,
    private supplierService: SupplierService,
    private readonly medicineService: MedicineService,
    private readonly returnOrderError: ReturnOrderError,
  ) {}

  async create(body: CreateWarehouseReturnOrderDto, currUser: IUser) {
    // brute force
    const { supplierId, medicineReturnOrder } = body;
    const medicineIds = body.medicineReturnOrder.map(
      ({ medicineId }) => medicineId as number,
    );
    // getting the medicines with the given ids and with this supplier
    const medicines = await this.medicineService.getMedicines(
      medicineIds,
      supplierId as number,
    );

    const details: {
      price: number;
      quantity: number;
      medicine: Medicine | number;
    }[] = [];
    let totalPrice = 0;
    // calculating totalPrice and creating the warehouse_returnOrder_details rows
    for (let i = 0; i < medicines.length; i++) {
      details.push({
        price: medicines[i].price * medicineReturnOrder[i].quantity,
        quantity: medicineReturnOrder[i].quantity,
        medicine: medicines[i].medicine.id,
      });
      totalPrice += medicines[i].price * medicineReturnOrder[i].quantity;
    }

    // creating the returnOrder
    const warehouseReturnOrder = new WarehouseReturnOrder();
    warehouseReturnOrder.supplier = supplierId as Supplier;
    warehouseReturnOrder.warehouse = currUser.warehouseId as Warehouse;
    warehouseReturnOrder.totalPrice = totalPrice;
    await this.warehouseReturnOrderRepository.save(warehouseReturnOrder);
    // creating the returnOrder details
    for (const detail of details) {
      const warehouseReturnOrderDetails = new WarehouseReturnOrderDetails();
      // warehouseReturnOrderDetails.medicine = detail.medicine as Medicine;
      warehouseReturnOrderDetails.price = detail.price;
      warehouseReturnOrderDetails.quantity = detail.quantity;
      warehouseReturnOrderDetails.warehouseReturnOrder = warehouseReturnOrder;
      await this.warehouseReturnOrderDetailsRepository.save(
        warehouseReturnOrderDetails,
      );
    }

    // returning the returnOrder id
    return { data: { id: warehouseReturnOrder.id } };
  }

  async findOne({ id }: IParams, user: IUser) {
    const returnOrder = await this.warehouseReturnOrderRepository.findOne({
      where: {
        id,
        warehouse: {
          id: user.warehouseId as number,
        },
      },
      select: {
        id: true,
        supplier: {
          id: true,
          name: true,
          phoneNumber: true,
          location: true,
          user: {
            email: true,
          },
        },
        details: {
          quantity: true,
          price: true,
          // medicine: {
          //   name: true,
          // },
        },
      },
      relations: {
        supplier: {
          user: true,
        },
        details: {
          // medicine: true,
        },
      },
    });

    if (!returnOrder) {
      throw new HttpException(
        this.returnOrderError.notFoundReturnOrder(),
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      data: new GetByIdWarehouseReturnOrder({ returnOrder }).toObject(),
    };
  }

  async findAll(
    { pagination, criteria }: { pagination: Pagination; criteria?: any },
    user: IUser,
  ) {
    const { skip, limit } = pagination;
    const { warehouseId } = user;
    const totalRecords = await this.warehouseReturnOrderRepository.count({
      where: {
        ...criteria,
        warehouse: {
          id: warehouseId as number,
        },
      },
    });
    const returnOrders = await this.warehouseReturnOrderRepository.find({
      where: {
        ...criteria,
        warehouse: {
          id: warehouseId as number,
        },
      },
      relations: {
        supplier: true,
      },
      select: {
        id: true,
        status: true,
        created_at: true,
        supplier: {
          name: true,
        },
        totalPrice: true,
      },
      skip,
      take: limit,
    });
    return {
      totalRecords,
      data: returnOrders.map((returnOrder) =>
        new GetAllWarehouseReturnOrder({ returnOrder }).toObject(),
      ),
    };
  }
}
