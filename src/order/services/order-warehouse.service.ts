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
  PharmacyOrderDetails,
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
import { GetAllOutcomingWarehouseOrder } from '../api/dto/response/get-by-criteria-warehouse-outcoming-order.dto';
import { GetByIdWarehouseOutcomingOrder } from '../api/dto/response/get-by-id-warehouse-outcoming-orders.dto';
import { GetByIdOrderDistribution } from '../api/dto/response/get-by-id-distribution-order.dto';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { PaymentService } from 'src/payment/services/payment.service';
import { ReturnOrderStatus } from 'src/return order/entities/returnOrder.entities';
import { filter } from 'rxjs';

@Injectable()
export class WarehouseOrderService {
  constructor(
    @InjectRepository(WarehouseOrder)
    private warehouseOrderRepository: Repository<WarehouseOrder>,
    @InjectRepository(PharmacyOrder)
    private pharmacyOrderRepository: Repository<PharmacyOrder>,

    @InjectRepository(WarehouseOrderDetails)
    private warehouseOrderDetailsRepository: Repository<WarehouseOrderDetails>,
    @InjectRepository(PharmacyOrderDetails)
    private pharmacyOrderDetailsRepository: Repository<PharmacyOrderDetails>,
    @InjectRepository(DistributionPharmacyOrder)
    private pharmacyDistributionRepository: Repository<DistributionPharmacyOrder>,
    private supplierService: SupplierService,
    private readonly paymentService: PaymentService,
    private readonly medicineService: MedicineService,
    private readonly orderError: OrderError,
    private readonly deliverService: DeliverService,
  ) {}

  private getCriteria(criteria: { status?: OrderStatus }): any {
    let filteringCriteria: {
      status?: OrderStatus;
    } = {};
    if (criteria.status) {
      filteringCriteria = {
        ...filteringCriteria,
        status: criteria.status,
      };
    }
    return filteringCriteria;
  }
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
        inventoryId: number | Inventory;
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

          medicines.set(medicine.id, medicineKey);
        }
      }

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
        await this.deliverService.removeMedicine(
          RepositoryEnum.WarehouseMedicine,
          user.warehouseId as number,
          {
            medicineId,
            quantity: inventoryMedicine.quantity,
          },
        );
        const medicine = await this.deliverService.removeMedicine(
          RepositoryEnum.InventoryMedicine,
          inventoryMedicine.inventoryId as number,
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
            inventory: distribution.inventoryId as Inventory,
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
    }
    return;
  }

  async acceptFastOrder({ id }: IParams, user: IUser) {
    const orders = await this.pharmacyOrderRepository.find({
      where: {
        isPublic: true,
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
        inventoryId: number | Inventory;
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

          medicines.set(medicine.id, medicineKey);
        }
      }

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
        await this.deliverService.removeMedicine(
          RepositoryEnum.WarehouseMedicine,
          user.warehouseId as number,
          {
            medicineId,
            quantity: inventoryMedicine.quantity,
          },
        );
        const medicine = await this.deliverService.removeMedicine(
          RepositoryEnum.InventoryMedicine,
          inventoryMedicine.inventoryId as number,
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
            inventory: distribution.inventoryId as Inventory,
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
    }

    const order = await this.pharmacyOrderRepository.findOne({
      where: {
        id,
      },
      select: {
        details: {
          id: true,
          quantity: true,
          medicine: {
            id: true,
          },
        },
      },
      relations: {
        details: {
          medicine: true,
        },
      },
    });

    let totalPrice = 0;
    for (const details of order.details) {
      const detailsId = details.id;
      const warehouseMedicine =
        await this.medicineService.findWarehouseMedicineByMedicine(
          details.medicine.id,
        );

      totalPrice += details.quantity * warehouseMedicine.price;
      await this.pharmacyOrderDetailsRepository.update(
        {
          id: detailsId,
        },
        {
          price: warehouseMedicine.price,
        },
      );
    }
    await this.pharmacyOrderRepository.update(
      {
        id,
      },
      {
        warehouse: user.warehouseId as Warehouse,
        totalPrice,
      },
    );
    return;
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
        pharmacy: {
          user: true,
        },
      },
      select: {
        id: true,
        warehouse: {
          id: true,
        },
        totalPrice: true,
        pharmacy: {
          id: true,
          user: {
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

    await this.paymentService.createDept(
      order.pharmacy.user.id,
      user.id,
      order.totalPrice,
    );

    await this.pharmacyOrderRepository.save(order);

    return;
  }

  async findOneIncoming({ id }: IParams, user: IUser) {
    // TODO: do the query using query builder
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
            image: {
              id: true,
              url: true,
            },
          },
        },
      },
      relations: {
        supplier: {
          user: true,
        },
        details: {
          medicine: {
            image: true,
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
      data: new GetByIdWarehouseOrder({ order }).toObject(),
    };
  }

  async findDistribution({ id }: IParams, user: IUser) {
    const distributions = await this.pharmacyDistributionRepository
      .createQueryBuilder('distributions')
      .leftJoinAndSelect('distributions.order', 'order')
      .leftJoinAndSelect('order.warehouse', 'warehouse')
      .leftJoinAndSelect('distributions.inventory', 'inventory')
      .leftJoinAndSelect('distributions.medicineDetails', 'medicineDetails')
      .leftJoinAndSelect('medicineDetails.medicine', 'medicine')
      .leftJoinAndSelect('medicine.image', 'image')
      .where('order.id = :orderId', { orderId: id })
      .andWhere('order.status = :status', {
        status: OrderStatus.Accepted,
      })
      .andWhere('warehouse.id = :warehouseId', {
        warehouseId: user.warehouseId as number,
      })
      .select([
        'inventory.id',
        'order.id',
        'inventory.name',
        'medicineDetails.id',
        'medicine.name',
        'medicineDetails.endDate',
        'image.url',
        'warehouse.id',
        'distributions.quantity',
      ])
      .getMany();

    if (!distributions.length) {
      throw new HttpException(
        this.orderError.notFoundOrder(),
        HttpStatus.NOT_FOUND,
      );
    }

    const map = new Map<
      number,
      {
        expireDate: Date;
        quantity: number;
        name: string;
        imageUrl: string | null;
      }[]
    >();

    for (const distribution of distributions) {
      const inventoryId = distribution.inventory.id;
      let inventoryMedicine = [];
      if (map.has(inventoryId)) {
        inventoryMedicine = map.get(inventoryId);
        continue;
      }
      inventoryMedicine.push({
        expireDate: distribution.medicineDetails.endDate,
        quantity: distribution.quantity,
        name: distribution.medicineDetails.medicine.name,
        imageUrl: distribution.medicineDetails.medicine.image?.url || null,
      });

      map.set(inventoryId, inventoryMedicine);
    }

    const distributed = new Map<number, boolean>();

    const response: {
      id: number;
      name: string;
      location: string;
      medicine: {
        expireDate: Date;
        quantity: number;
        name: string;
        imageUrl: string | null;
      }[];
    }[] = [];

    for (const distribution of distributions) {
      const inventoryId = distribution.inventory.id;
      if (distributed.has(inventoryId)) {
        continue;
      }
      const inventoryMedicine = map.get(inventoryId);
      distributed.set(inventoryId, true);
      response.push({
        id: inventoryId,
        name: distribution.inventory.name,
        location: distribution.inventory.location,
        medicine: inventoryMedicine,
      });
    }
    return {
      data: response.map((distribution) =>
        new GetByIdOrderDistribution({ distribution }).toObject(),
      ),
    };
  }

  async findOneOutcoming({ id }: IParams, user: IUser) {
    // TODO: do the query using query builder
    const order = await this.pharmacyOrderRepository.findOne({
      where: {
        id,
        warehouse: {
          id: user.warehouseId as number,
        },
      },
      select: {
        id: true,
        status: true,
        pharmacy: {
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
            image: {
              id: true,
              url: true,
            },
          },
        },
      },
      relations: {
        pharmacy: {
          user: true,
        },
        details: {
          medicine: {
            image: true,
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
      data: new GetByIdWarehouseOutcomingOrder({ order }).toObject(),
    };
  }

  async findOneFast({ id }: IParams, user: IUser) {
    // TODO: do the query using query builder
    const order = await this.pharmacyOrderRepository.findOne({
      where: [
        {
          id,
          isPublic: true,
          status: OrderStatus.Pending,
        },
        {
          id,
          isPublic: true,
          warehouse: {
            id: user.warehouseId as number,
          },
        },
      ],
      select: {
        id: true,
        status: true,
        pharmacy: {
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
            image: {
              id: true,
              url: true,
            },
          },
        },
      },
      relations: {
        pharmacy: {
          user: true,
        },
        details: {
          medicine: {
            image: true,
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
      data: new GetByIdWarehouseOutcomingOrder({ order }).toObject(),
    };
  }

  async findAllIncoming(
    {
      pagination,
      criteria,
    }: {
      pagination: Pagination;
      criteria?: {
        status?: OrderStatus;
      };
    },
    user: IUser,
  ) {
    const { skip, limit } = pagination;
    const { warehouseId } = user;
    const filteringCriteria = this.getCriteria(criteria);
    const [orders, totalRecords] =
      await this.warehouseOrderRepository.findAndCount({
        where: {
          ...filteringCriteria,
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

  async findAllOutcoming(
    {
      pagination,
      criteria,
    }: {
      pagination: Pagination;
      criteria?: {
        status?: OrderStatus;
      };
    },
    user: IUser,
  ) {
    const { skip, limit } = pagination;
    const { warehouseId } = user;

    const filteringCriteria = this.getCriteria(criteria);
    const [orders, totalRecords] =
      await this.pharmacyOrderRepository.findAndCount({
        where: {
          ...filteringCriteria,
          warehouse: {
            id: warehouseId as number,
          },
        },
        relations: {
          pharmacy: true,
        },
        select: {
          id: true,
          status: true,
          created_at: true,
          pharmacy: {
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
        new GetAllOutcomingWarehouseOrder({ order }).toObject(),
      ),
    };
  }
  async findAllFastOrders(
    {
      pagination,
      criteria,
    }: {
      pagination: Pagination;
      criteria?: {
        status?: OrderStatus;
      };
    },
    user: IUser,
  ) {
    const { skip, limit } = pagination;
    const { warehouseId } = user;
    let query = {};

    query['isPublic'] = true;
    query['status'] = criteria.status;
    if (criteria.status !== OrderStatus.Pending) {
      query['warehouse'] = warehouseId;
    }

    console.log(query);
    const [orders, totalRecords] =
      await this.pharmacyOrderRepository.findAndCount({
        where: {
          ...query,
        },
        relations: {
          pharmacy: true,
        },
        select: {
          id: true,
          status: true,
          created_at: true,
          pharmacy: {
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
        new GetAllOutcomingWarehouseOrder({ order }).toObject(),
      ),
    };
  }

  async rejectOrder({ id }: IParams, user: IUser) {
    const order = await this.pharmacyOrderRepository.findOne({
      where: [
        {
          id: id,
          warehouse: {
            id: user.warehouseId as number,
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
    await this.pharmacyOrderRepository.save(order);
  }
}
