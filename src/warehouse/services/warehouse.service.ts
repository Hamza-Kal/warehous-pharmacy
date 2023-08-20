import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
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
import { AdminGetAllWarehouses } from 'src/admin/api/dto/warehouse-dtos/find-all.dto';
import { AdminGetByIdWarehouse } from 'src/admin/api/dto/warehouse-dtos/find-one.dto';
import { WarehouseError } from './warehouse-error.service';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    private warehouseError: WarehouseError,
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

  async findOneOrFail(id: number) {
    const warehouse = await this.warehouseRepository.findOne({
      where: {
        id,
      },
    });

    if (!warehouse) {
      throw new HttpException(
        this.warehouseError.notFoundWarehouse(),
        HttpStatus.NOT_FOUND,
      );
    }

    return warehouse;
  }

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

  async getWarehouseInfo(user: IUser) {
    const warehouseId = user.warehouseId as number;
    const warehouse = await this.warehouseRepository.findOne({
      where: {
        id: warehouseId,
      },
    });
    if (!warehouse) throw new NotFoundException('warehouse not found');
    return {
      data: warehouse,
    };
  }

  async getAllInventories(criteria: { name?: string }, user: IUser) {
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
    let inventories = warehouse.inventories;
    if (criteria.name) {
      inventories = inventories.filter((inventory) =>
        inventory.name.includes(criteria.name),
      );
    }
    return {
      totalRecords: warehouse.inventories.length,
      data: inventories.map((inventory) =>
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
        this.warehouseError.notFoundWarehouse(),
        HttpStatus.NOT_FOUND,
      );
    return {
      data: new GetByIdWarehouse({ warehouse }).toObject(),
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
    const warehouses = await this.warehouseRepository.find({
      where: filteringCriteria,
      select: ['id', 'location', 'name', 'phoneNumber'],
      take: limit,
      skip,
    });
    const totalRecrods = await this.warehouseRepository.count({
      where: filteringCriteria,
    });
    return {
      totalRecrods,
      data: warehouses.map((warehouse) =>
        new AdminGetAllWarehouses({ warehouse }).toObject(),
      ),
    };
  }

  async AdminfindOne(id: number) {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id },
      select: {
        id: true,
        location: true,
        phoneNumber: true,
        name: true,
        owner: {
          id: true,
          email: true,
          fullName: true,
          assignedRole: true,
        },
      },
      relations: {
        owner: true,
      },
    });
    if (!warehouse)
      throw new HttpException(
        this.warehouseError.notFoundWarehouse(),
        HttpStatus.NOT_FOUND,
      );
    return {
      data: new AdminGetByIdWarehouse({ warehouse }).toObject(),
    };
  }
}
