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
import { WarehouseMedicines } from '../api/dto/reponse/warehouse-medicines-get-by-criteria.dto';
import { sk } from '@faker-js/faker';
import { GetInventoriesDistributionsDto } from '../api/response/get-inventories-distributions.dto';
import { MedicineInventoryService } from './medicine-inventory.service';
import { InventoryMedicineDetailsDto } from '../api/dto/reponse/inventory-medicine-details.dto';
import { PharmacyGetWarehouseMedicine } from '../api/dto/reponse/pharmacy-get-warehouse-medicines.dto';
import { PharmacyGetByIdWarehouseMedicine } from '../api/dto/reponse/pharmacy-get-by-id-warehouse-medicine.dto';

@Injectable()
export class PharmacyMedicineService {
  constructor(
    @InjectRepository(WarehouseMedicine)
    private warehouseMedicineRepository: Repository<WarehouseMedicine>,
    @InjectRepository(MedicineDetails)
    private medicineDetails: Repository<MedicineDetails>,
    private medicineError: MedicineError,
  ) {}

  async findAllWarehouse({ criteria, pagination }, warehouseId: number) {
    const { skip, limit } = pagination;
    const totalRecords = await this.warehouseMedicineRepository.count({
      where: {
        ...criteria,
        warehouse: {
          id: warehouseId,
        },
        price: Not(0),
      },
    });
    const medicines = await this.warehouseMedicineRepository
      .createQueryBuilder('warehouse_medicine')
      .leftJoinAndSelect('warehouse_medicine.warehouse', 'warehouse')
      .leftJoinAndSelect('warehouse_medicine.medicine', 'medicine')
      .leftJoinAndSelect('medicine.category', 'category')
      .leftJoinAndSelect('medicine.image', 'image')
      .where('warehouse.id = :id', { id: warehouseId as number })
      .andWhere('price != 0')
      .select([
        'warehouse.id',
        'warehouse_medicine.id',
        'warehouse_medicine.price',
        'warehouse_medicine.quantity',
        'medicine.id',
        'medicine.name',
        'category.category',
        'image.url',
      ])
      .take(limit)
      .skip(skip)
      .getMany();
    return {
      totalRecords,
      data: medicines.map((medicine) =>
        new PharmacyGetWarehouseMedicine({
          medicine,
        }).toObject(),
      ),
    };
  }

  async findOneWarehouse(medicineId: number) {
    const medicine = await this.warehouseMedicineRepository
      .createQueryBuilder('warehouse_medicine')
      .leftJoinAndSelect('warehouse_medicine.warehouse', 'warehouse')
      .leftJoinAndSelect('warehouse_medicine.medicine', 'medicine')
      .leftJoinAndSelect('medicine.category', 'category')
      .leftJoinAndSelect('medicine.image', 'image')
      .where('warehouse_medicine.id = :id', { id: medicineId as number })
      .andWhere('price != 0')
      .andWhere('quantity != 0')
      .select([
        'warehouse.id',
        'warehouse_medicine.id',
        'warehouse_medicine.price',
        'warehouse_medicine.quantity',
        'medicine.id',
        'medicine.name',
        'category.category',
        'image.url',
        'medicine.description',
      ])
      .getOne();
    return {
      data: new PharmacyGetByIdWarehouseMedicine({
        medicine,
      }).toObject(),
    };
  }
}
