import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Warehouse } from '../entities/warehouse.entity';
import { ILike, Repository } from 'typeorm';
import { paginationParser } from 'src/shared/pagination/pagination';
import { FindAllWarehousesQueryDto } from '../api/dto/query/find-all-warehouses.dto';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { GetAllWarehousesForSupplierDto } from '../api/dto/response/get-all-warehouses-only-name.dto';
@Injectable()
export class WarehouseSupplierService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  getCriteria(queryCriteria: { name?: string }) {
    let criteria: any = {};
    if (queryCriteria.name) {
      criteria = {
        ...criteria,
        name: ILike(`%${queryCriteria.name}%`),
      };
    }
    return criteria;
  }

  async getWarehouses({
    pagination,
    criteria,
  }: {
    pagination: Pagination;
    criteria?: { name?: string };
  }) {
    const { skip, limit } = pagination;
    const filteringCriteria = this.getCriteria(criteria);
    const [warehouses, totalRecords] =
      await this.warehouseRepository.findAndCount({
        where: filteringCriteria,
        select: ['id', 'name'],
        take: limit,
        skip,
      });

    return {
      totalRecords,
      data: warehouses.map((warehouse) =>
        new GetAllWarehousesForSupplierDto({ warehouse }).toObject(),
      ),
    };
  }
}
