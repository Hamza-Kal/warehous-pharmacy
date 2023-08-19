import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Warehouse } from '../entities/warehouse.entity';
import { CreateWarehouseDto } from '../api/dto/create-warehouse.dto';
import { IUser } from 'src/shared/interface/user.interface';
import { UserService } from 'src/user/services/user.service';
import { SupplierService } from 'src/supplier/service/supplier.service';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { MedicineError } from 'src/medicine/services/medicine-error.service';
import { WarehouseMedicineService } from 'src/medicine/services/medicine-warehouse.service';
import { UpdateWareHouseDto } from '../api/dto/update-warehouse.dto';
import { WarehouseError } from './warehouse-error.service';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { GetAllWarehousesPharmacy } from '../api/dto/response/get-all-warehouses-pharmacy-dto';

@Injectable()
export class WarehousePharmacyService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
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

  async findAll({
    pagination,
    criteria,
  }: {
    pagination?: Pagination;
    criteria?: any;
  }) {
    const { skip, limit } = pagination;
    const filteringCriteria = this.getCriteria(criteria);

    const warehouses = await this.warehouseRepository.find({
      where: filteringCriteria,
      select: ['id', 'location', 'name', 'phoneNumber'],
      take: limit,
      skip,
    });
    const totalRecords = await this.warehouseRepository.count({
      where: filteringCriteria,
    });
    return {
      totalRecords,
      data: warehouses.map((warehouse) =>
        new GetAllWarehousesPharmacy({ warehouse }).toObject(),
      ),
    };
  }
}
