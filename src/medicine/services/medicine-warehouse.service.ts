import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/shared/interface/user.interface';
import {
  Category,
  Medicine,
  MedicineDetails,
} from '../entities/medicine.entities';
import { ILike, In, Not, Repository, SelectQueryBuilder } from 'typeorm';
import { MedicineError } from './medicine-error.service';
import { WarehouseGetSupplierMedicines } from '../api/response/get-medicines-supplier-for-warehouse.dto';
import {
  InventoryMedicine,
  InventoryMedicineDetails,
  SupplierMedicine,
  WarehouseMedicine,
  WarehouseMedicineDetails,
} from '../entities/medicine-role.entities';
import { WarehouseGetMedicines } from '../api/response/warehouse-get-medicines.dto';
import { UpdatePriceDto } from '../api/dto/warehouseDto/update-medicine-price.dto';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import {
  TransferFromInventoryDto,
  TransferToInventoryDto,
} from 'src/warehouse/api/dto/transfer-to-inventory';
import { MedicineService } from './medicine.service';
import {
  DeliverService,
  RepositoryEnum,
} from 'src/deliver/service/deliver.service';
import { IParams } from 'src/shared/interface/params.interface';
import { WarehouseMedicines } from '../api/dto/response/warehouse-medicines-get-by-criteria.dto';
import { sk } from '@faker-js/faker';
import { GetInventoriesDistributionsDto } from '../api/response/get-inventories-distributions.dto';
import { MedicineInventoryService } from './medicine-inventory.service';
import { InventoryMedicineDetailsDto } from '../api/dto/response/inventory-medicine-details.dto';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { WarehouseGetBatches } from '../api/response/get-warehouse-batches.dto';
import { InventoryMedicinesDto } from '../api/dto/response/warehouse-get-by-id-inventory-medicine.dto';

@Injectable()
export class WarehouseMedicineService {
  constructor(
    @InjectRepository(Medicine)
    private medicineRepository: Repository<Medicine>,
    @InjectRepository(SupplierMedicine)
    private supplierMedicineRepository: Repository<SupplierMedicine>,
    @InjectRepository(WarehouseMedicine)
    private warehouseMedicineRepository: Repository<WarehouseMedicine>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(MedicineDetails)
    private medicineDetails: Repository<MedicineDetails>,
    private medicineError: MedicineError,
    @InjectRepository(WarehouseMedicine)
    private warehouseMedicine: Repository<WarehouseMedicine>,
    @InjectRepository(InventoryMedicine)
    private inventoryMedicineRepository: Repository<InventoryMedicine>,
    @InjectRepository(WarehouseMedicineDetails)
    private warehouseMedicineDetailsRepository: Repository<WarehouseMedicineDetails>,
    @InjectRepository(InventoryMedicineDetails)
    private inventoryMedicineDetailsRepository: Repository<InventoryMedicineDetails>,
    private inventoryMedicineService: MedicineInventoryService,
    private readonly medicineService: MedicineService,
    private deliverService: DeliverService,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) {}

  AddCriteriaWarehouseMedicine(
    dbQuery: SelectQueryBuilder<WarehouseMedicine>,
    queryParams: { name?: string; category?: string },
  ) {
    if (queryParams.name) {
      dbQuery.andWhere('medicine.name LIKE :name', {
        name: `%${queryParams.name}%`,
      });
    }
    if (queryParams.category) {
      dbQuery.andWhere('category.category = :category', {
        category: queryParams.category,
      });
    }
    return dbQuery;
  }

  AddCriteriaSupplierMedicine(
    dbQuery: SelectQueryBuilder<SupplierMedicine>,
    queryParams: { name?: string; category?: string },
  ) {
    if (queryParams.name) {
      dbQuery.andWhere('medicine.name LIKE :name', {
        name: `%${queryParams.name}%`,
      });
    }
    if (queryParams.category) {
      dbQuery.andWhere('category.category = :category', {
        category: queryParams.category,
      });
    }
    return dbQuery;
  }
  async findAllSuppliers(
    {
      criteria,
      pagination,
    }: {
      criteria: { name?: string; category?: string };
      pagination: Pagination;
    },
    supplierId: number,
  ) {
    const { skip, limit } = pagination;
    const medicinesQuery = this.supplierMedicineRepository
      .createQueryBuilder('supplier_medicine')
      .leftJoinAndSelect('supplier_medicine.supplier', 'supplier')
      .leftJoinAndSelect('supplier_medicine.medicine', 'medicine')
      .leftJoinAndSelect('medicine.category', 'category')
      .where('supplier.id = :id', { id: supplierId as number })
      .andWhere('supplier_medicine.price != 0')
      .leftJoinAndSelect('medicine.image', 'image')
      .select([
        'supplier.id',
        'supplier_medicine.id',
        'supplier_medicine.price',
        'supplier_medicine.quantity',
        'medicine.id',
        'medicine.name',
        'category.category',
        'image.id',
        'image.url',
      ])
      .take(limit)
      .skip(skip);
    const dbQuery = this.AddCriteriaSupplierMedicine(medicinesQuery, criteria);
    const medicines = await dbQuery.getMany();
    return {
      totalRecords: await dbQuery.getCount(),
      data: medicines.map((medicine) =>
        new WarehouseGetSupplierMedicines({
          supplierMedicine: medicine,
        }).toObject(),
      ),
    };
  }

  async findAllWarehouse(
    {
      criteria,
      pagination,
    }: { criteria?: { category?: string }; pagination: Pagination },
    user: IUser,
  ) {
    const { skip, limit } = pagination;
    const totalRecords = await this.warehouseMedicineRepository.count({
      where: {
        medicine: {
          category: {
            category: criteria.category,
          },
        },
        warehouse: {
          id: user.warehouseId as number,
        },
        quantity: Not(0),
        medicineDetails: {
          quantity: Not(0),
        },
      },
    });

    const query = this.warehouseMedicineRepository
      .createQueryBuilder('warehouse_medicine')
      .leftJoinAndSelect('warehouse_medicine.warehouse', 'warehouse')
      .leftJoinAndSelect('warehouse_medicine.medicine', 'medicine')
      .leftJoinAndSelect(
        'warehouse_medicine.medicineDetails',
        'outerMedicineDetails',
      )
      .leftJoinAndSelect('medicine.image', 'image')
      .leftJoinAndSelect('medicine.category', 'category')
      .leftJoinAndSelect('medicine.supplier', 'supplier')
      .leftJoinAndSelect(
        'outerMedicineDetails.medicineDetails',
        'medicineDetails',
      )
      .where('warehouse.id = :id', { id: user.warehouseId })
      .andWhere('warehouse_medicine.quantity > 0', { quantity: 0 })
      .andWhere('outerMedicineDetails.quantity > 0')
      .select([
        'warehouse_medicine.id',
        'medicine.id',
        'medicine.name',
        'category.category',
        'outerMedicineDetails.id',
        'outerMedicineDetails.quantity',
        'medicineDetails.id',
        'medicineDetails.endDate',
        'supplier.id',
        'supplier.name',
        'image.id',
        'image.url',
      ])
      .take(limit)
      .skip(skip);

    if (criteria.category) {
      query.andWhere('category.category = :category', {
        category: criteria.category,
      });
    }

    const medicines = await query.getMany();

    return {
      totalRecords,
      data: medicines.map((medicine) =>
        new WarehouseMedicines({
          medicine,
        }).toObject(),
      ),
    };
  }

  async findAll(
    {
      criteria,
      pagination,
    }: {
      pagination: Pagination;
      criteria?: { name?: string; category?: string };
    },
    user: IUser,
  ) {
    const { skip, limit } = pagination;
    const medicinesQuery = this.warehouseMedicineRepository
      .createQueryBuilder('warehouse_medicine')
      .leftJoinAndSelect('warehouse_medicine.warehouse', 'warehouse')
      .leftJoinAndSelect('warehouse_medicine.medicine', 'medicine')
      .leftJoinAndSelect('medicine.supplier', 'supplier')
      .leftJoinAndSelect('medicine.image', 'image')
      .leftJoinAndSelect('medicine.category', 'category')
      .where('warehouse.id = :id', { id: user.warehouseId })
      .andWhere('warehouse_medicine.quantity > 0', { quantity: 0 })
      .select([
        'warehouse_medicine.id',
        'warehouse_medicine.quantity',
        'warehouse_medicine.price',
        'medicine.id',
        'category.category',
        'medicine.name',
        'image.id',
        'image.url',
        'supplier.name',
      ])
      .take(limit)
      .skip(skip);
    const dbQuery = this.AddCriteriaWarehouseMedicine(medicinesQuery, criteria);
    const medicines = await dbQuery.getMany();
    return {
      totalRecords: await dbQuery.getCount(),
      data: medicines.map((medicine) =>
        new WarehouseGetMedicines({
          warehouseMedicine: medicine,
        }).toObject(),
      ),
    };
  }

  async findAllInventoryMedicines(
    { pagination, criteria }: { pagination: Pagination; criteria: any },
    { id }: IParams,
    user: IUser,
  ) {
    const { skip, limit } = pagination;
    const totalRecords = await this.inventoryMedicineRepository.count({
      where: {
        inventory: {
          id,
          warehouse: {
            id: user.warehouseId as number,
          },
        },
      },
    });
    const medicinesQuery = this.inventoryMedicineRepository
      .createQueryBuilder('inventory_medicine')
      .leftJoinAndSelect('inventory_medicine.inventory', 'inventory')
      .leftJoinAndSelect('inventory.warehouse', 'warehouse')
      .leftJoinAndSelect('inventory_medicine.medicine', 'medicine')
      .leftJoinAndSelect(
        'inventory_medicine.medicineDetails',
        'outerMedicineDetails',
      )
      .leftJoinAndSelect('medicine.image', 'image')
      .leftJoinAndSelect('medicine.category', 'category')
      .leftJoinAndSelect('medicine.supplier', 'supplier')
      .leftJoinAndSelect(
        'outerMedicineDetails.medicineDetails',
        'medicineDetails',
      )
      .where('inventory.id = :id', { id })
      .andWhere('warehouse.id = :id', { id: user.warehouseId as number })
      .andWhere('inventory_medicine.quantity > 0', { quantity: 0 })
      .andWhere('outerMedicineDetails.quantity > 0')
      .select([
        'inventory_medicine.id',
        'medicine.id',
        'medicine.name',
        'category.category',
        'outerMedicineDetails.id',
        'outerMedicineDetails.quantity',
        'medicineDetails.id',
        'medicineDetails.endDate',
        'supplier.id',
        'supplier.name',
        'image.id',
        'image.url',
      ])
      .take(limit)
      .skip(skip);
    const medicines = await medicinesQuery.getMany();
    return {
      totalRecords: medicinesQuery.getCount(),
      data: medicines.map((medicine) =>
        new InventoryMedicinesDto({
          medicine,
        }).toObject(),
      ),
    };
  }

  //? get all the medicineDetails of the inventories
  async findAllInventoriesMedicine({ id }: IParams, user: IUser) {
    const medicine = await this.warehouseMedicineRepository.findOne({
      where: {
        id,
        warehouse: {
          id: user.warehouseId as number,
        },
      },
      select: {
        id: true,
        medicine: {
          id: true,
          name: true,
        },
      },
      relations: {
        medicine: true,
      },
    });

    if (!medicine) {
      throw new HttpException(
        this.medicineError.notEnoughMedicine(),
        HttpStatus.NOT_FOUND,
      );
    }

    const inventoryDistribution =
      await this.inventoryMedicineService.getInventoriesMedicine(
        medicine.medicine.id,
        user.warehouseId as number,
      );

    return {
      data: inventoryDistribution.map((details) =>
        new InventoryMedicineDetailsDto({
          details,
        }).toObject(),
      ),
    };
  }

  async findInventoryDistributions(warehouseMedicineId: number, user: IUser) {
    const { warehouseId } = user;
    const warehouseMedicine = await this.warehouseMedicineRepository.findOne({
      where: {
        id: warehouseMedicineId,
        warehouse: {
          id: warehouseId as number,
        },
        quantity: Not(0),
      },
      relations: {
        medicine: true,
      },
    });
    if (!warehouseMedicine)
      throw new HttpException(
        this.medicineError.notFoundMedicine(),
        HttpStatus.NOT_FOUND,
      );
    const medicine = await this.medicineRepository.findOne({
      where: {
        id: warehouseMedicine.medicine.id,
      },
    });
    if (!medicine)
      throw new HttpException(
        this.medicineError.notFoundMedicine(),
        HttpStatus.NOT_FOUND,
      );
    const inventoryMedicines = await this.inventoryMedicineRepository.find({
      where: {
        medicine: {
          id: medicine.id,
        },
        inventory: {
          warehouse: {
            id: warehouseId as number,
          },
        },
        quantity: Not(0),
      },
      select: {
        id: true,
        quantity: true,
        inventory: {
          phoneNumber: true,
          manager: {
            id: true,
            fullName: true,
          },
          name: true,
        },
        medicine: {
          name: true,
        },
      },
      relations: {
        inventory: {
          manager: true,
        },
        medicine: true,
      },
    });
    return {
      data: inventoryMedicines.map((inventoryMedicine) =>
        new GetInventoriesDistributionsDto({ inventoryMedicine }).toObject(),
      ),
    };
  }
  async findOne({ id }: IParams, user: IUser) {
    const medicine = await this.warehouseMedicineRepository.findOne({
      where: {
        warehouse: {
          id: user.warehouseId as number,
        },
        id,
        quantity: Not(0),
      },
      relations: {
        medicine: {
          category: true,
          image: true,
          supplier: true,
          inventoryMedicine: true,
        },
      },
    });
    return {
      data: new WarehouseGetMedicines({
        warehouseMedicine: medicine,
      }).toObject(),
    };
  }

  async findMedicineDetails({ id }: IParams, user: IUser) {
    const batches = await this.warehouseMedicineDetailsRepository.find({
      where: {
        medicine: {
          id,
          warehouse: {
            id: user.warehouseId as number,
          },
        },
        quantity: Not(0),
      },
      select: {
        id: true,
        quantity: true,
      },
    });
    return {
      data: batches.map((batch) =>
        new WarehouseGetBatches({
          warehouseBatches: batch,
        }).toObject(),
      ),
    };
  }

  async findOneSupplierMedicine(id: number) {
    const medicine = await this.supplierMedicineRepository.findOne({
      where: { id, quantity: Not(0) },
      relations: {
        medicine: {
          category: true,
          image: true,
        },
      },
      select: {
        medicine: {
          name: true,
          category: {
            category: true,
          },
          image: {
            id: true,
            url: true,
          },
        },
        id: true,
        price: true,
      },
    });
    if (!medicine) {
      throw new HttpException(
        this.medicineError.notFoundMedicine(),
        HttpStatus.BAD_GATEWAY,
      );
    }
    return {
      data: new WarehouseGetSupplierMedicines({
        supplierMedicine: medicine,
      }).toObject(),
    };
  }

  async update(id: number, body: UpdatePriceDto, user: IUser) {
    await this.warehouseMedicineRepository.update(
      {
        id,
        warehouse: {
          id: user.warehouseId as number,
        },
      },
      {
        price: body.price,
      },
    );
  }
  async findSingleMedicineWarehouse(medicineId: number, warehouseId: number) {
    return this.warehouseMedicine.findOne({
      where: {
        id: medicineId,
        warehouse: {
          id: warehouseId,
        },
      },
    });
  }

  // TODO check for duplicate batch id in dto

  async transferToInventory(
    { id }: IParams,
    body: TransferToInventoryDto,
    owner: IUser,
  ) {
    const { warehouseId } = owner;
    const { batch } = body;
    const inventoryId = id;

    const inventory = await this.inventoryRepository.findOne({
      where: {
        id: inventoryId,
        warehouse: {
          id: warehouseId as number,
        },
      },
    });

    if (!inventory) {
      throw new HttpException(
        this.medicineError.notFoundInventory(),
        HttpStatus.NOT_FOUND,
      );
    }

    const warehouseMedicineDetails =
      await this.warehouseMedicineDetailsRepository.findOne({
        where: {
          id: batch.batchId,
          medicine: {
            warehouse: {
              id: owner.warehouseId as number,
            },
          },
          quantity: Not(0),
        },
        relations: {
          medicine: {
            // getting the original medicine table
            medicine: true,
          },
          medicineDetails: true,
        },
        select: {
          medicine: {
            id: true,
            medicine: { id: true },
          },
          id: true,
          quantity: true,
          medicineDetails: {
            id: true,
          },
        },
      });

    if (!warehouseMedicineDetails)
      throw new HttpException(
        this.medicineError.notFoundMedicine(),
        HttpStatus.NOT_FOUND,
      );

    const inventoryMedicines = [];

    const inventoryMedicinesDetails: {
      quantity: number;
      medicineDetails: number;
    }[] = [];
    const medicineId = warehouseMedicineDetails.medicine.id;

    const movedQuantity = batch.quantity;
    if (warehouseMedicineDetails.quantity < movedQuantity) {
      throw new HttpException(
        this.medicineError.notEnoughMedicine(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const inventoryMedicine = await this.deliverService.deliverMedicine(
      RepositoryEnum.InventoryMedicine,
      inventoryId,
      {
        quantity: batch.quantity,
        medicineId: warehouseMedicineDetails.medicine.medicine.id,
      },
    );

    // { quantity: 99, medicineDetails: MedicineDetails { id: 32 } }
    await this.deliverService.deliverMedicineDetails(
      RepositoryEnum.InventoryMedicineDetails,
      {
        medicineDetails: warehouseMedicineDetails.medicineDetails.id,
        medicineId: inventoryMedicine.id,
        quantity: batch.quantity,
      },
    );

    await this.deliverService.removeMedicineDetails(
      RepositoryEnum.WarehouseMedicineDetails,
      {
        medicineDetails: warehouseMedicineDetails.medicineDetails.id,
        medicineId: medicineId,
        quantity: batch.quantity,
      },
    );

    return;
  }
  async transferFromInventory(body: TransferFromInventoryDto, owner: IUser) {
    const { warehouseId } = owner;
    const { batches, from, to } = body;

    const transferFrominventory = await this.inventoryRepository.findOne({
      where: {
        id: from,
        warehouse: {
          id: warehouseId as number,
        },
      },
    });

    const transferToInventory = await this.inventoryRepository.findOne({
      where: {
        id: to,
        warehouse: {
          id: warehouseId as number,
        },
      },
    });

    if (!transferFrominventory || !transferToInventory) {
      throw new HttpException(
        this.medicineError.notFoundInventory(),
        HttpStatus.NOT_FOUND,
      );
    }

    const toBeMovedMedicine: {
      medicineId: number;
      roleMedicineId: number; // for the role table like (inventoryMedicine warehouseMedicine ...)
      quantity: number;
      medicineDetailsId: number;
    }[] = [];
    for (const batch of batches) {
      const inventoryMedicine =
        await this.inventoryMedicineDetailsRepository.findOne({
          where: {
            id: batch.batchId,
            medicine: {
              inventory: {
                id: from as number,
              },
            },
          },
          relations: {
            medicine: {
              // getting the original medicine table
              medicine: true,
            },
            medicineDetails: true,
          },
          select: {
            medicine: {
              id: true,
              medicine: { id: true },
            },
            id: true,
            quantity: true,
            medicineDetails: {
              id: true,
            },
          },
        });

      if (!inventoryMedicine)
        throw new HttpException(
          this.medicineError.notFoundMedicine(),
          HttpStatus.NOT_FOUND,
        );

      const movedQuantity = batch.quantity;
      if (inventoryMedicine.quantity < movedQuantity) {
        throw new HttpException(
          this.medicineError.notEnoughMedicine(),
          HttpStatus.BAD_REQUEST,
        );
      }
      toBeMovedMedicine.push({
        medicineId: inventoryMedicine.medicine.medicine.id,
        roleMedicineId: inventoryMedicine.medicine.id,
        quantity: movedQuantity,
        medicineDetailsId: inventoryMedicine.medicineDetails.id,
      });
    }

    for (const medicine of toBeMovedMedicine) {
      const deliverdMedicine = await this.deliverService.deliverMedicine(
        RepositoryEnum.InventoryMedicine,
        to,
        {
          quantity: medicine.quantity,
          medicineId: medicine.medicineId,
        },
      );

      // { quantity: 99, medicineDetails: MedicineDetails { id: 32 } }
      await this.deliverService.deliverMedicineDetails(
        RepositoryEnum.InventoryMedicineDetails,
        {
          medicineDetails: medicine.medicineDetailsId,
          medicineId: deliverdMedicine.id,
          quantity: medicine.quantity,
        },
      );

      const fromMedicine = await this.deliverService.removeMedicine(
        RepositoryEnum.InventoryMedicine,
        from,
        {
          medicineId: medicine.medicineId,
          quantity: medicine.quantity,
        },
      );
      await this.deliverService.removeMedicineDetails(
        RepositoryEnum.InventoryMedicineDetails,
        {
          medicineDetails: medicine.medicineDetailsId,
          medicineId: fromMedicine.id,
          quantity: medicine.quantity,
        },
      );
    }
    return;
  }
}
