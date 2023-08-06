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
import { GetByIdMedicineSupplier } from '../api/response/get-by-id-medicine-supplier.dto';
import { WarehouseGetMedicines } from '../api/response/warehouse-get-medicines.dto';
import { UpdatePriceDto } from '../api/dto/warehouseDto/update-medicine-price.dto';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { TransferToInventoryDto } from 'src/warehouse/api/dto/transfer-to-inventory';
import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { MedicineService } from './medicine.service';
import {
  DeliverService,
  RepositoryEnum,
} from 'src/deliver/service/deliver.service';

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
  ) {}

  async findAllSuppliers({ criteria, pagination }, supplierId: number) {
    const { skip, limit } = pagination;
    const medicines = await this.supplierMedicineRepository.find({
      where: {
        ...criteria,
        supplier: {
          id: supplierId,
        },
      },
      relations: {
        medicine: {
          category: true,
        },
      },
      skip,
      take: limit,
    });

    return {
      data: medicines.map((medicine) =>
        new WarehouseGetSupplierMedicines({
          supplierMedicine: medicine,
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
    const medicines = await this.warehouseMedicineRepository.find({
      where: {
        ...criteria,
        warehouse: {
          id: user.warehouseId,
        },
      },
      relations: {
        medicine: {
          category: true,
        },
      },
      skip,
      take: limit,
    });

    return {
      totalRecords,
      data: medicines.map((medicine) =>
        new WarehouseGetMedicines({
          warehouseMedicine: medicine,
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
  async transferToInventory(body: TransferToInventoryDto, owner: IUser) {
    const { warehouseId } = owner;
    const { inventoryId, batches } = body;

    const batchQuantity = new Map<number, number>();
    const batchIds = [];
    for (const batch of batches) {
      batchIds.push(batch.batchId);
      batchQuantity.set(batch.batchId, batch.quantity);
    }

    const warehouseMedicineDetails =
      await this.warehouseMedicineDetailsRepository.find({
        where: {
          id: In(batchIds),
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

    if (warehouseMedicineDetails.length !== batchIds.length)
      throw new HttpException(
        this.medicineError.notFoundMedicine(),
        HttpStatus.NOT_FOUND,
      );

    const inventoryMedicines = [];
    let wholeQuantity = 0;
    const inventoryMedicinesDetails: {
      quantity: number;
      medicineDetails: number;
    }[] = [];
    const medicineId = warehouseMedicineDetails[0].medicine.id;
    for (const medicineDetail of warehouseMedicineDetails) {
      if (medicineDetail.medicine.id !== medicineId) {
        throw new HttpException(
          this.medicineError.notFoundMedicine(),
          HttpStatus.NOT_FOUND,
        );
      }

      const movedQuantity = batchQuantity.get(medicineDetail.id);
      if (medicineDetail.quantity < movedQuantity) {
        throw new HttpException(
          this.medicineError.notEnoughMedicine(),
          HttpStatus.BAD_REQUEST,
        );
      }
      wholeQuantity += movedQuantity;
      inventoryMedicinesDetails.push({
        quantity: movedQuantity,
        medicineDetails: medicineDetail.medicineDetails.id,
      });
    }

    const inventoryMedicine = await this.deliverService.deliverMedicine(
      RepositoryEnum.InventoryMedicine,
      inventoryId,
      {
        quantity: wholeQuantity,
        medicineId: warehouseMedicineDetails[0].medicine.medicine.id,
      },
    );
    for (const inventoryMedicineDetail of inventoryMedicinesDetails) {
      // { quantity: 99, medicineDetails: MedicineDetails { id: 32 } }
      await this.deliverService.deliverMedicineDetails(
        RepositoryEnum.InventoryMedicineDetails,
        {
          medicineId: inventoryMedicine.id,
          quantity: inventoryMedicineDetail.quantity,
        },
      );

      await this.deliverService.removeMedicineDetails(
        RepositoryEnum.WarehouseMedicineDetails,
        {
          medicineDetails: inventoryMedicineDetail.medicineDetails,
          medicineId: medicineId,
          quantity: inventoryMedicineDetail.quantity,
        },
      );
    }

    return;
  }
}
