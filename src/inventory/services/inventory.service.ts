import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInventoryDto } from '../dtos/create-inventory.dto';
import { Inventory } from '../entities/inventory.entity';
import { UpdateInventoryDto } from '../dtos/update-inventory.entity';
import { NotFoundError } from 'rxjs';
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
    const inventory = await this.inventoryRepository.create({
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
