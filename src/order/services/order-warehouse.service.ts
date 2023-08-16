import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { IUser } from 'src/shared/interface/user.interface';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { SupplierService } from 'src/supplier/service/supplier.service';
import {
  DistributionPharmacyOrder,
  OrderStatus,
  PharmacyOrder,
  WarehouseOrder,
  WarehouseOrderDetails,
} from '../entities/order.entities';
import { CreateWarehouseOrderDto } from '../api/dto/create-warehouse-order.dto';
import { MedicineService } from 'src/medicine/services/medicine.service';
import { MedicineError } from 'src/medicine/services/medicine-error.service';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import {
  Medicine,
  MedicineDetails,
} from 'src/medicine/entities/medicine.entities';
import { GetAllWarehouseOrder } from '../api/dto/response/get-warehouse-order.dto';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { IParams } from 'src/shared/interface/params.interface';
import { OrderError } from './order-error.service';
import { GetByIdWarehouseOrder } from '../api/dto/response/get-by-id-warehouse-order.dto';
import {
  DeliverService,
  RepositoryEnum,
} from 'src/deliver/service/deliver.service';

@Injectable()
export class WarehouseOrderService {
  constructor(
    @InjectRepository(WarehouseOrder)
    private warehouseOrderRepository: Repository<WarehouseOrder>,
    @InjectRepository(PharmacyOrder)
    private pharmacyOrderRepository: Repository<PharmacyOrder>,

    @InjectRepository(WarehouseOrderDetails)
    private warehouseOrderDetailsRepository: Repository<WarehouseOrderDetails>,
    @InjectRepository(DistributionPharmacyOrder)
    private pharmacyDistributionRepository: Repository<DistributionPharmacyOrder>,
    private supplierService: SupplierService,
    private readonly medicineService: MedicineService,
    private readonly orderError: OrderError,
    private readonly deliverService: DeliverService,
  ) {}

  async create(body: CreateWarehouseOrderDto, currUser: IUser) {
    // brute force
    const { supplierId, medicineOrder } = body;
    const medicineIds = body.medicineOrder.map(
      ({ medicineId }) => medicineId as number,
    );
    // getting the medicines with the given ids and with this supplier
    const medicines = await this.medicineService.getSupplierMedicines(
      medicineIds,
      supplierId as number,
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
    const warehouseOrder = new WarehouseOrder();
    warehouseOrder.supplier = supplierId as Supplier;
    warehouseOrder.warehouse = currUser.warehouseId as Warehouse;
    warehouseOrder.totalPrice = totalPrice;

    await this.warehouseOrderRepository.save(warehouseOrder);
    // creating the order details
    for (const detail of details) {
      const warehouseOrderDetails = new WarehouseOrderDetails();
      warehouseOrderDetails.medicine = detail.medicine as Medicine;
      warehouseOrderDetails.price = detail.price;
      warehouseOrderDetails.quantity = detail.quantity;
      warehouseOrderDetails.warehouseOrder = warehouseOrder;
      await this.warehouseOrderDetailsRepository.save(warehouseOrderDetails);
    }

    // returning the order id
    return { data: { id: warehouseOrder.id } };
  }

  async acceptOrder({ id }: IParams, user: IUser) {
    const date = new Date();

    const orders = await this.pharmacyOrderRepository.find({
      where: {
        warehouse: {
          id: user.warehouseId as number,
        },
        status: OrderStatus.Pending,
        id,
      },
      select: {
        details: {
          id: true,
          medicine: {
            id: true,
          },
          quantity: true,
        },
      },
      relations: {
        details: {
          medicine: true,
        },
      },
    });

    if (!orders.length) {
      throw new HttpException(
        this.orderError.notFoundOrder(),
        HttpStatus.NOT_FOUND,
      );
    }

    const map = new Map<number, number>();
    for (const { quantity, medicine } of orders[0].details) {
      if (!map.has(medicine.id)) {
        map.set(medicine.id, quantity);
        continue;
      }
      const medicineQuantity = map.get(medicine.id);
      map.set(medicine.id, quantity + medicineQuantity);
    }

    /**
     * {
     *    key
     *    medicineId,
     *    value
     *    [
     *      {
     *          inventoryId,
     *          batchId,
     *          quantity,
     *      }
     *    ]
     * }
     */
    const medicines = new Map<
      number,
      {
        inventoryId: number;
        batchId: number | MedicineDetails;
        quantity: number;
      }[]
    >();
    //? get all the medicines for the inventories that this warehouse has ordered by expireDate
    for (const { quantity, medicine } of orders[0].details) {
      medicines.set(medicine.id, []);
      const inventoriesMedicines =
        await this.medicineService.getInventoriesMedicines(
          user.warehouseId as number,
          medicine.id,
        );

      let wholeQuantity = quantity;

      for (const { medicineDetails, inventory } of inventoriesMedicines) {
        console.log('detailssss,', medicineDetails);
        for (const details of medicineDetails) {
          if (!wholeQuantity) break;
          const batchQuantity = Math.min(details.quantity, wholeQuantity);
          wholeQuantity -= batchQuantity;

          const medicineKey = medicines.get(medicine.id);
          medicineKey.push({
            inventoryId: inventory.id,
            batchId: details.medicineDetails.id,
            quantity: batchQuantity,
          });
          console.log('hererere', medicineKey);
          medicines.set(medicine.id, medicineKey);
        }
      }
      console.log('medicinesss', medicines);

      if (wholeQuantity)
        throw new HttpException(
          this.orderError.notEnoughMedicine(),
          HttpStatus.BAD_REQUEST,
        );
    }

    for (const medicine of medicines) {
      const medicineId = medicine[0];
      const inventoriesMedicines = medicine[1];
      for (const inventoryMedicine of inventoriesMedicines) {
        const medicine = await this.deliverService.removeMedicine(
          RepositoryEnum.InventoryMedicine,
          inventoryMedicine.inventoryId,
          {
            medicineId,
            quantity: inventoryMedicine.quantity,
          },
        );

        await this.deliverService.removeMedicineDetails(
          RepositoryEnum.InventoryMedicineDetails,
          {
            medicineId: medicine.id,
            quantity: inventoryMedicine.quantity,
            medicineDetails: inventoryMedicine.batchId as number,
          },
        );
      }
    }
    //remove the medicines from the supplier medicines table

    // move the medicines to the pending table
    for (const medicine of medicines) {
      for (const distribution of medicine[1]) {
        const pharmacyDistribution = this.pharmacyDistributionRepository.create(
          {
            order: orders[0],
            quantity: distribution.quantity,
            medicineDetails: distribution.batchId as MedicineDetails,
          },
        );

        await this.pharmacyDistributionRepository.save(pharmacyDistribution);
      }

      // accept the order
      await this.pharmacyOrderRepository.update(
        {
          id,
        },
        {
          status: OrderStatus.Accepted,
        },
      );
      return;
    }
  }

  //! price is not assigned here so when making payment table
  async deliveredOrder({ id }: IParams, user: IUser) {
    const order = await this.pharmacyOrderRepository.findOne({
      where: {
        id,
        warehouse: {
          id: user.warehouseId as number,
        },
        status: OrderStatus.Accepted,
      },
      relations: {
        warehouse: true,
        pharmacy: true,
      },
      select: {
        id: true,
        warehouse: {
          id: true,
        },
        totalPrice: true,
        pharmacy: {
          id: true,
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

    const distributions = await this.pharmacyDistributionRepository.find({
      where: { order: { id } },
      relations: {
        order: {
          pharmacy: true,
        },
        medicineDetails: {
          medicine: true,
        },
      },
      select: {
        order: {
          pharmacy: {
            id: true,
          },
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

    //* Create medicine details for warehouseMedicineDetails table
    for (const distribution of distributions) {
      const pharmacyMedicine = await this.deliverService.deliverMedicine(
        RepositoryEnum.PharmacyMedicine,
        order.pharmacy.id,
        {
          medicineId: distribution.medicineDetails.medicine.id,
          quantity: distribution.quantity,
        },
      );

      await this.deliverService.deliverMedicineDetails(
        RepositoryEnum.PharmacyMedicineDetails,
        {
          medicineDetails: distribution.medicineDetails.id,
          medicineId: pharmacyMedicine.id,
          quantity: distribution.quantity,
        },
      );
    }

    await this.pharmacyOrderRepository.save(order);

    return;
  }

  async findOne({ id }: IParams, user: IUser) {
    const order = await this.warehouseOrderRepository.findOne({
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
          medicine: {
            name: true,
          },
        },
      },
      relations: {
        supplier: {
          user: true,
        },
        details: {
          medicine: true,
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
      data: new GetByIdWarehouseOrder({ order }).toObject(),
    };
  }

  async findAll(
    { pagination, criteria }: { pagination: Pagination; criteria?: any },
    user: IUser,
  ) {
    const { skip, limit } = pagination;
    const { warehouseId } = user;
    const totalRecords = await this.warehouseOrderRepository.count({
      where: {
        ...criteria,
        warehouse: {
          id: warehouseId as number,
        },
      },
    });
    const orders = await this.warehouseOrderRepository.find({
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
      data: orders.map((order) =>
        new GetAllWarehouseOrder({ order }).toObject(),
      ),
    };
  }
}
