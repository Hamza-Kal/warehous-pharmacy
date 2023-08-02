import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Warehouse } from '../entities/warehouse.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { IUser } from 'src/shared/interface/user.interface';
import { GetAllInventories } from '../api/dto/response/get-all-inventories.dto';
import { Role } from 'src/shared/enums/roles';

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
  async getAllInventories(user: IUser) {
    const { inventories } = await this.warehouseRepository.findOne({
      where: {
        id: user.warehouseId as number,
        inventories: {
          manager: {
            role: Role.INVENTORY,
          },
        },
      },
      relations: {
        inventories: {
          manager: true,
        },
      },
      select: {
        inventories: {
          name: true,
          location: true,
          phoneNumber: true,
          id: true,
          manager: {
            fullName: true,
          },
        },
      },
    });
    return {
      totalRecords: inventories.length,
      data: inventories.map((inventory) =>
        new GetAllInventories({ inventory }).toObject(),
      ),
    };
  }
}
