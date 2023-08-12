import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Warehouse } from '../entities/warehouse.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { IUser } from 'src/shared/interface/user.interface';
import { Role } from 'src/shared/enums/roles';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { GetAllWarehouses } from 'src/warehouse/api/dto/response/get-all-warehouses.dto';
import { GetAllInventories } from '../../inventory/dtos/response/get-all-inventories.dto';
import { GetByIdWarehouse } from '../api/dto/response/get-by-id-warehouse.dto';
import { MedicineError } from 'src/medicine/services/medicine-error.service';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    private errorsService: MedicineError,
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
  async findAll({
    pagination,
    criteria,
  }: {
    pagination?: Pagination;
    criteria?: FindOptionsWhere<Warehouse> | FindOptionsWhere<Warehouse>[];
  }) {
    const { skip, limit } = pagination;
    const warehouses = await this.warehouseRepository.find({
      where: {
        ...criteria,
      },
      select: ['id', 'location', 'name', 'phoneNumber'],
      take: limit,
      skip,
    });
    const totalRecrods = await this.warehouseRepository.count({
      where: {
        ...criteria,
      },
    });
    return {
      totalRecrods,
      data: warehouses.map((warehouse) =>
        new GetAllWarehouses({ warehouse }).toObject(),
      ),
    };
  }

  async getAllInventories(user: IUser) {
    const warehouse = await this.warehouseRepository.findOne({
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
    if (!warehouse) {
      return [];
    }

    return {
      totalRecords: warehouse.inventories.length,
      data: warehouse.inventories.map((inventory) =>
        new GetAllInventories({ inventory }).toObject(),
      ),
    };
  }

  async findOne(id: number) {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id },
      select: ['id', 'location', 'name', 'phoneNumber'],
      relations: {
        owner: true,
      },
    });
    if (!warehouse)
      throw new HttpException(
        this.errorsService.notFoundWarehouse(),
        HttpStatus.NOT_FOUND,
      );
    return {
      data: new GetByIdWarehouse({ warehouse }).toObject(),
    };
  }
}
