import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Warehouse } from '../entities/warehouse.entity';
import { CreateWarehouseDto } from '../api/dto/create-warehouse.dto';
import { IUser } from 'src/shared/interface/user.interface';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { SupplierService } from 'src/supplier/service/supplier.service';

@Injectable()
export class WarehouseWebService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    private userService: UserService,
    private supplierService: SupplierService,
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
}
