import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from '../entities/warehouse.entity';
import { CreateWarehouseDto } from '../api/dto/create-warehouse.dto';
import { IUser } from 'src/shared/interface/user.interface';
import { UserService } from 'src/user/services/user.service';
import { SupplierService } from 'src/supplier/service/supplier.service';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { MedicineError } from 'src/medicine/services/medicine-error.service';
import { WarehouseMedicineService } from 'src/medicine/services/medicine-warehouse.service';
import { UpdateWareHouseDto } from '../api/dto/update-warehouse.dto';
import { WarehouseError } from './warehouse-error.service';
import { Pagination } from 'src/shared/pagination/pagination.validation';

@Injectable()
export class WarehouseWebService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    private userService: UserService,
    private supplierService: SupplierService,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    private warehouseError: WarehouseError,
    private warehouseMedicineService: WarehouseMedicineService,
  ) {}

  // async getAllInventories(id: number) {
  //   const inventories = await this.warehouseInventoryRepository.find({
  //     where: { warehouseId: id },
  //     relations: ['inventoy'],
  //   });

  // }

  async createWarehouse(body: CreateWarehouseDto, currUser: IUser) {
    //TODO PUT ALL THESE FUNCTION IN TRANSACTION
    const user = await this.userService.completeInfo(currUser.id);
    body.owner = user;
    const warehouse = this.warehouseRepository.create(body);
    await this.warehouseRepository.save(warehouse);
    return { data: { id: warehouse.id } };
  }

  async update(body: UpdateWareHouseDto, user: IUser) {
    const warehouse = await this.warehouseRepository.findOne({
      where: {
        id: user.warehouseId as number,
      },
    });

    if (!warehouse) {
      throw new HttpException(
        this.warehouseError.notFoundWarehouse(),
        HttpStatus.NOT_FOUND,
      );
    }

    await this.warehouseRepository.update(
      {
        id: user.warehouseId as number,
      },
      {
        ...body,
        ...warehouse,
      },
    );
  }

  async getAllSuppliers(criteria: { name?: string }) {
    return await this.supplierService.findAll(criteria);
  }

  async getSupplierById(id: number) {
    return await this.supplierService.findOne(id);
  }
}
