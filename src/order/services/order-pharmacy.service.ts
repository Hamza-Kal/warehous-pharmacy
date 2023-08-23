import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUser } from 'src/shared/interface/user.interface';
import { SupplierService } from 'src/supplier/service/supplier.service';
import {
  DistributionPharmacyOrder,
  OrderStatus,
  PharmacyOrder,
  PharmacyOrderDetails,
} from '../entities/order.entities';
import {
  CreateFastOrder,
  CreatePharmacyOrderDto,
} from '../api/dto/create-warehouse-order.dto';
import { MedicineService } from 'src/medicine/services/medicine.service';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Medicine } from 'src/medicine/entities/medicine.entities';
import { OrderError } from './order-error.service';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { IParams } from 'src/shared/interface/params.interface';
import { GetByIdWarehouseOrder } from '../api/dto/response/get-by-id-warehouse-order.dto';
import { GetByIdPharmacyOrder } from '../api/dto/response/get-by-id-pharmacy-order.dto';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { GetAllWarehouseOrder } from '../api/dto/response/get-warehouse-order.dto';
import { GetAllPharmacyOrder } from '../api/dto/response/get-all-pharmacy-order.dto';

@Injectable()
export class PharmacyOrderService {
  constructor(
    @InjectRepository(PharmacyOrder)
    private pharmacyOrderRepository: Repository<PharmacyOrder>,

    @InjectRepository(PharmacyOrderDetails)
    private pharmacyOrderDetailsRepository: Repository<PharmacyOrderDetails>,
    @InjectRepository(DistributionPharmacyOrder)
    private pharmacyDistributionRepository: Repository<DistributionPharmacyOrder>,
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

  async createFastOrder(body: CreateFastOrder, currUser: IUser) {
    // brute force
    const { medicineOrder } = body;
    const medicineIds = body.medicineOrder.map(
      ({ medicineId }) => medicineId as number,
    );
    // getting the medicines with the given ids and with this supplier
    const medicines = await this.medicineService.checkMedicines(
      medicineIds,
      currUser.warehouseId as number,
    );

    const details: {
      price: number;
      quantity: number;
      medicine: Medicine | number;
    }[] = [];

    for (let i = 0; i < medicines.length; i++) {
      details.push({
        price: medicines[i].price,
        quantity: medicineOrder[i].quantity,
        medicine: medicines[i].medicine.id,
      });
    }

    // creating the order
    const pharmacyOrder = new PharmacyOrder();
    pharmacyOrder.pharmacy = currUser.pharmacyId as Pharmacy;
    pharmacyOrder.isPublic = true;

    await this.pharmacyOrderRepository.save(pharmacyOrder);

    // creating the order details
    for (const detail of details) {
      const pharmacyOrderDetails = new PharmacyOrderDetails();
      pharmacyOrderDetails.medicine = detail.medicine as Medicine;
      pharmacyOrderDetails.quantity = detail.quantity;
      pharmacyOrderDetails.pharmacyOrder = pharmacyOrder;
      await this.pharmacyOrderDetailsRepository.save(pharmacyOrderDetails);
    }

    // returning the order id
    return { data: { id: pharmacyOrder.id } };
  }

  async findOne({ id }: IParams, user: IUser) {
    const [order] = await this.pharmacyOrderRepository.find({
      where: {
        id,
        pharmacy: {
          id: user.pharmacyId as number,
        },
      },
      select: {
        id: true,
        warehouse: {
          id: true,
          name: true,
          phoneNumber: true,
          location: true,
          owner: {
            email: true,
          },
        },
        details: {
          quantity: true,
          price: true,
          medicine: {
            id: true,
            name: true,
          },
        },
        distribution: {
          quantity: true,
          medicineDetails: {
            id: true,
            medicine: {
              id: true,
            },
          },
        },
      },
      relations: {
        warehouse: {
          owner: true,
        },
        details: {
          medicine: true,
        },
        distribution: {
          medicineDetails: {
            medicine: true,
          },
        },
      },
    });

    if (!order) {
      throw new HttpException(
        this.orderError.notFoundOrder(),
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      data: new GetByIdPharmacyOrder({ order }).toObject(),
    };
  }

  //TODO get back when alaa finish the ui
  async findDetails({ id }: IParams, user: IUser) {
    const distribution = await this.pharmacyDistributionRepository.find({
      where: {
        order: {
          id,
          status: OrderStatus.Delivered,
          pharmacy: {
            id: user.pharmacyId as number,
          },
        },
      },
      relations: {
        order: {
          warehouse: true,
        },
        medicineDetails: {
          medicine: {
            image: true,
          },
        },
      },
      select: {
        quantity: true,
        order: {
          created_at: true,
          warehouse: {
            name: true,
            phoneNumber: true,
            location: true,
          },
        },
        medicineDetails: {
          id: true,
          endDate: true,
          medicine: {
            name: true,
            image: {
              url: true,
            },
          },
        },
      },
    });

    if (!distribution) {
      throw new HttpException(
        this.orderError.notFoundOrder(),
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      // data: new GetByIdPharmacyOrder({ order }).toObject(),
    };
  }

  async findAll(
    {
      pagination,
      criteria,
    }: { pagination: Pagination; criteria?: { status: OrderStatus } },
    user: IUser,
  ) {
    const { skip, limit } = pagination;
    const { pharmacyId } = user;

    const totalRecords = await this.pharmacyOrderRepository.count({
      where: [
        {
          pharmacy: {
            id: pharmacyId as number,
          },
          ...criteria,
        },
      ],
    });
    const orders = await this.pharmacyOrderRepository.find({
      where: {
        ...criteria,

        pharmacy: {
          id: pharmacyId as number,
        },
      },
      relations: {
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
      data: orders.map((order) =>
        new GetAllPharmacyOrder({ order }).toObject(),
      ),
    };
  }
}
