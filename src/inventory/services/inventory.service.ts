import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateInventoryDto } from '../dtos/create-inventory.dto';
import { Inventory } from '../entities/inventory.entity';

import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { GetAllInventories } from 'src/inventory/dtos/response/get-all-inventories.dto';
import { GetByIdInventory } from '../dtos/response/get-by-id-inventory.dto';
import { MedicineError } from 'src/medicine/services/medicine-error.service';
import { AdminGetByIdInventory } from 'src/admin/api/dto/inventory-dtos/find-one.dto';
import { AdminGetAllInventories } from 'src/admin/api/dto/inventory-dtos/find-all.dto';
import { fi } from '@faker-js/faker';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    private errorsService: MedicineError,
  ) {}

  getCriteria(queryCriteria: { name: string }) {
    let criteria: any = {};
    if (queryCriteria.name) {
      criteria = {
        ...criteria,
        name: ILike(`%${queryCriteria.name}%`),
      };
    }
    return criteria;
  }

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
    const { skip, limit } = pagination;
    const inventories = await this.inventoryRepository.find({
      where: {
        ...criteria,
      },
      select: ['id', 'location', 'name', 'phoneNumber'],
      take: limit,
      skip,
    });
    const totalRecords = await this.inventoryRepository.count({
      where: {
        ...criteria,
      },
      select: ['id', 'location', 'name', 'phoneNumber'],
      take: limit,
      skip,
    });
    return {
      totalRecords,
      data: inventories.map((inventory) =>
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

  async AdminfindAll({
    pagination,
    criteria,
  }: {
    pagination?: Pagination;
    criteria?: { name: string };
  }) {
    const { skip, limit } = pagination;
    const filteringCriteria = this.getCriteria(criteria);

    const inventories = await this.inventoryRepository.find({
      where: filteringCriteria,
      select: ['id', 'location', 'name', 'phoneNumber'],
      take: limit,
      skip,
    });
    const totalRecords = await this.inventoryRepository.count({
      where: filteringCriteria,
      select: ['id', 'location', 'name', 'phoneNumber'],
      take: limit,
      skip,
    });
    return {
      totalRecords,
      data: inventories.map((inventory) =>
        new AdminGetAllInventories({ inventory }).toObject(),
      ),
    };
  }

  async AdminfindOne(id: number) {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
      select: {
        id: true,
        location: true,
        phoneNumber: true,
        name: true,
        manager: {
          id: true,
          email: true,
          fullName: true,
          assignedRole: true,
        },
      },
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
      data: new AdminGetByIdInventory({ inventory }).toObject(),
    };
  }
}
