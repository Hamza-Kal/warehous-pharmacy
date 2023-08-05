import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Warehouse } from '../entities/warehouse.entity';
import { CreateWarehouseDto } from '../api/dto/create-warehouse.dto';
import { IUser } from 'src/shared/interface/user.interface';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { SupplierService } from 'src/supplier/service/supplier.service';
import { TransferToInventoryDto } from '../api/dto/transfer-to-inventory';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MedicineError } from 'src/medicine/services/medicine-error.service';
import { WarehouseMedicineService } from 'src/medicine/services/medicine-warehouse.service';
import {
  InventoryMedicine,
  WarehouseMedicine,
  WarehouseMedicineDetails,
} from 'src/medicine/entities/medicine-role.entities';

@Injectable()
export class WarehouseWebService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    private userService: UserService,
    private supplierService: SupplierService,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    private medicineError: MedicineError,
    private warehouseMedicineService: WarehouseMedicineService,
    @InjectRepository(InventoryMedicine)
    private inventoryMedicineRepository: Repository<InventoryMedicine>,
    @InjectRepository(WarehouseMedicine)
    private warehouseMedicineRepository: Repository<WarehouseMedicine>,
    @InjectRepository(WarehouseMedicineDetails)
    private warehouseMedicineDetailsRepository: Repository<WarehouseMedicineDetails>,
  ) {}

  // async getAllInventories(id: number) {
  //   const inventories = await this.warehouseInventoryRepository.find({
  //     where: { warehouseId: id },
  //     relations: ['inventoy'],
  //   });
  //   console.log(inventories);
  // }

  async createWarehouse(body: CreateWarehouseDto, currUser: IUser) {
    //TODO PUT ALL THESE FUNCTION IN TRANSACTION
    const user = await this.userService.completeInfo(currUser.id);
    body.owner = user;
    const warehouse = this.warehouseRepository.create(body);
    await this.warehouseRepository.save(warehouse);
    return { data: { id: warehouse.id } };
  }

  async getAllSuppliers() {
    // { pagination, criteria }
    return await this.supplierService.findAll({});
  }

  async getSupplierById(id: number) {
    return await this.supplierService.findOne(id);
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
