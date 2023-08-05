import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/shared/interface/user.interface';
import {
  Category,
  Medicine,
  MedicineDetails,
} from '../entities/medicine.entities';
import { Not, Repository } from 'typeorm';
import { MedicineError } from './medicine-error.service';
import { WarehouseGetSupplierMedicines } from '../api/response/get-medicines-supplier-for-warehouse.dto';
import {
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
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(WarehouseMedicineDetails)
    private warehouseMedicineDetailsRepository: Repository<WarehouseMedicineDetails>,
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

  async transferToInventory(body: TransferToInventoryDto, owner: IUser) {
    const { warehouseId } = owner;
    const { inventoryId, batches } = body;

    // check if inventory exists
    const inventory = await this.inventoryRepository.findOne({
      where: {
        id: inventoryId,
        warehouse: {
          id: warehouseId as number,
        },
      },
    });
    if (!inventory) throw new NotFoundException('inventory not found');
    if (!batches.length) throw new BadRequestException('no batches provided');
    // make sure that all bathces are for one medicine and this medicine exists
    // on my warehouse

    let medicineWarehouseId = -1;
    for (const batch of batches) {
      const { batchId } = batch;
      const warehouseMedicineBatch =
        await this.warehouseMedicineDetailsRepository.findOne({
          where: {
            id: batchId,
          },
        });
      if (!warehouseMedicineBatch) {
        throw new NotFoundException('batch provided does not exist');
      }
      if (medicineWarehouseId === -1)
        medicineWarehouseId = warehouseMedicineBatch.medicine.id;
      else if (medicineWarehouseId != warehouseMedicineBatch.medicine.id) {
        throw new BadRequestException(
          'there is no such batch for this medicine',
        );
      }
    }
    const myWarehouseMedicine = await this.warehouseMedicineRepository.findOne({
      where: {
        id: medicineWarehouseId,
        warehouse: {
          id: warehouseId as number,
        },
      },
    });
    if (!myWarehouseMedicine) {
      throw new BadRequestException(
        'the provided batches belong to medicine that the warehouse does not accquire',
      );
    }
  }
}
