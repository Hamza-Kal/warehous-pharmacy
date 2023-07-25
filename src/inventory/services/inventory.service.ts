import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInventoryDto } from '../dtos/create-inventory.dto';
import { Inventory } from '../entities/inventory.entity';

import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) {}

  async create(
    { name, phoneNumber, location, manager }: CreateInventoryDto,
    warehouse: Warehouse,
  ) {
    const inventory = this.inventoryRepository.create({
      name,
      phoneNumber,
      location,
      manager,
      warehouse,
    });
    await this.inventoryRepository.save(inventory);
    return inventory;
  }
}
