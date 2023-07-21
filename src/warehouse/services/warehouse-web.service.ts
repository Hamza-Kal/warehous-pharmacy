import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Warehouse } from '../entities/warehouse.entity';
import { CreateWarehouseDto } from '../api/dto/create-warehouse.dto';

@Injectable()
export class WarehouseWebService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    // private warehouseInventoryRepository: Repository<WarehouseInventory>,
    private dataSource: DataSource,
  ) {}

  // async getAllInventories(id: number) {
  //   const inventories = await this.warehouseInventoryRepository.find({
  //     where: { warehouseId: id },
  //     relations: ['inventoy'],
  //   });
  //   console.log(inventories);
  // }

  async createWarehouse(data: CreateWarehouseDto) {
    const warehouse = await this.warehouseRepository.create(data);
    return this.warehouseRepository.save(warehouse);
  }
}
