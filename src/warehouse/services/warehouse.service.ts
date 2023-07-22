import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Warehouse } from '../entities/warehouse.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) {}

  async findByUser(id: number) {
    return await this.warehouseRepository.findOne({
      where: {
        owner: {
          id,
        },
      },
    });
  }
  async getAllInventories(warehouseOwnerId: number) {
    return await this.inventoryRepository.find({
      where: {
        warehouse: {
          owner: {
            id: warehouseOwnerId,
          },
        },
      },
    });
  }
}
