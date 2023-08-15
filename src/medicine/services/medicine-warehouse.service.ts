import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/shared/interface/user.interface';
import {
  Category,
  Medicine,
  MedicineDetails,
} from '../entities/medicine.entities';
import { In, Not, Repository } from 'typeorm';
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
import { TransferToInventoryDto } from 'src/warehouse/api/dto/transfer-to-inventory';
import { MedicineService } from './medicine.service';
import {
  DeliverService,
  RepositoryEnum,
} from 'src/deliver/service/deliver.service';
import { IParams } from 'src/shared/interface/params.interface';
import { WarehouseMedicines } from '../api/dto/reponse/warehouse-medicines-get-by-criteria.dto';
import { sk } from '@faker-js/faker';

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
    private readonly medicineService: MedicineService,
    private deliverService: DeliverService,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) {}

  async findAllSuppliers({ criteria, pagination }, supplierId: number) {
    const { skip, limit } = pagination;
    const totalRecords = await this.supplierMedicineRepository.count({
      where: {
        ...criteria,
        supplier: {
          id: supplierId,
        },
      },
    });
    const medicines = await this.supplierMedicineRepository
      .createQueryBuilder('supplier_medicine')
      .leftJoinAndSelect('supplier_medicine.supplier', 'supplier')
      .leftJoinAndSelect('supplier_medicine.medicine', 'medicine')
      .leftJoinAndSelect('medicine.category', 'category')
      .where('supplier.id = :id', { id: supplierId as number })
      // .leftJoinAndSelect('medicine.image', 'image')
      .select([
        'supplier.id',
        'supplier_medicine.id',
        'supplier_medicine.price',
        'supplier_medicine.quantity',
        'medicine.id',
        'medicine.name',
        'category.category',
        // 'image.id',
        // 'image.url',
      ])
      .take(limit)
      .skip(skip)
      .getMany();
    return {
      totalRecords,
      data: medicines.map((medicine) =>
        new WarehouseGetSupplierMedicines({
          supplierMedicine: medicine,
        }).toObject(),
      ),
    };
  }

  async findAllWarehouse({ criteria, pagination }, user: IUser) {
    const { skip, limit } = pagination;
    const totalRecords = await this.warehouseMedicineRepository.count({
      where: {
        ...criteria,
        warehouse: {
          id: user.warehouseId,
        },
        medicineDetails: {
          quantity: Not(0),
        },
      },
    });
    const mmedicines = await this.warehouseMedicineRepository
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
      // .andWhere('outerMedicineDetails.quantity != quantity', { quantity: 0 })
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
      .skip(skip)
      .getMany();
    // const medicines = await this.warehouseMedicineRepository.find({
    //   where: {
    //     ...criteria,
    //     warehouse: {
    //       id: user.warehouseId,
    //     },
    //   },
    //   select: {
    //     id: true,
    //     medicineDetails: {
    //       id: true,
    //       quantity: true,
    //       medicineDetails: {
    //         id: true,
    //         endDate: true,
    //       },
    //     },
    //     medicine: {
    //       name: true,
    //     },
    //   },
    //   relations: {
    //     medicineDetails: {
    //       medicineDetails: true,
    //     },
    //     medicine: {
    //       category: true,
    //       supplier: true,
    //     },
    //   },
    //   skip,
    //   take: limit,
    // });
    // console.log(mmedicines);
    return {
      totalRecords,
      data: mmedicines.map((medicine) =>
        new WarehouseMedicines({
          medicine,
        }).toObject(),
      ),
    };
  }

  async findAll({ criteria, pagination }, user: IUser) {
    const { skip, limit } = pagination;
    const totalRecords = await this.warehouseMedicineRepository.count({
      where: {
        ...criteria,
        warehouse: {
          id: user.warehouseId,
        },
      },
    });
    const medicines = await this.warehouseMedicineRepository
      .createQueryBuilder('warehouse_medicine')
      .leftJoinAndSelect('warehouse_medicine.warehouse', 'warehouse')
      .leftJoinAndSelect('warehouse_medicine.medicine', 'medicine')
      .leftJoinAndSelect('medicine.image', 'image')
      .leftJoinAndSelect('medicine.category', 'category')
      .where('warehouse.id = :id', { id: user.warehouseId })
      .select([
        'warehouse_medicine.id',
        'warehouse_medicine.quantity',
        'warehouse_medicine.price',
        'medicine.id',
        'category.category',
        'medicine.name',
        'image.id',
        'image.url',
      ])
      .take(limit)
      .skip(skip)
      .getMany();
    return {
      totalRecords,
      data: medicines.map((medicine) =>
        new WarehouseGetMedicines({
          warehouseMedicine: medicine,
        }).toObject(),
      ),
    };
  }
  async findOne({ id }: IParams, user: IUser) {
    const medicines = await this.warehouseMedicineRepository.find({
      where: {
        warehouse: {
          id: user.warehouseId as number,
        },
        id,
        medicineDetails: true,
      },
      relations: {
        medicine: {
          category: true,
          image: true,
        },
        medicineDetails: true,
      },
    });

    if (!medicines.length) {
      throw new HttpException(
        this.medicineError.notFoundMedicine(),
        HttpStatus.NOT_FOUND,
      );
    }
    const medicine = medicines[0];
    return {
      data: new WarehouseGetMedicines({
        warehouseMedicine: medicine,
      }).toObject(),
    };
  }

  async findOneSupplierMedicine(id: number) {
    const medicine = await this.supplierMedicineRepository.findOne({
      where: { id, quantity: Not(0) },
      relations: {
        medicine: {
          category: true,
        },
      },
      select: {
        medicine: {
          name: true,
          category: {
            category: true,
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
}
