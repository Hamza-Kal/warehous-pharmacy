import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateInventoryDto } from '../dtos/create-inventory.dto';
import { Inventory } from '../entities/inventory.entity';

import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { GetAllInventories } from 'src/inventory/dtos/response/get-all-inventories.dto';
import { GetByIdInventory } from '../dtos/response/get-by-id-pharmacy.dto';
import { MedicineError } from 'src/medicine/services/medicine-error.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    private errorsService: MedicineError,
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

  async findAll({
    pagination,
    criteria,
  }: {
    pagination?: Pagination;
    criteria?: FindOptionsWhere<Inventory> | FindOptionsWhere<Inventory>[];
  }) {
    // const { skip, limit } = pagination;
    const suppliers = await this.inventoryRepository.find({
      where: {
        ...criteria,
      },
      select: ['id', 'location', 'name', 'phoneNumber'],
      // take: limit,
      // skip,
    });
    return {
      data: suppliers.map((inventory) =>
        new GetAllInventories({ inventory }).toObject(),
      ),
    };
  }

  async findOne(id: number) {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
      select: ['id', 'location', 'name', 'phoneNumber'],
      relations: {
        manager: true,
      },
    });
    if (!inventory)
      throw new HttpException(
        this.errorsService.notFoundInventory(),
        HttpStatus.NOT_FOUND,
      );
    return {
      data: new GetByIdInventory({ inventory }).toObject(),
    };
  }
}
