import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Warehouse } from '../entities/warehouse.entity';
import { WarehouseError } from './warehouse-error.service';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { GetAllWarehousesPharmacy } from '../api/dto/response/get-all-warehouses-pharmacy-dto';
import { RateWarehouseDto } from '../api/dto/rate-warehouse.dto';

@Injectable()
export class WarehousePharmacyService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    private errorsService: WarehouseError,
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
      select: ['id', 'location', 'name', 'phoneNumber', 'rating'],
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

  async findOne(warehouseId: number) {
    const warehouse = await this.warehouseRepository.findOne({
      where: {
        id: warehouseId,
      },
      select: ['id', 'name', 'location', 'phoneNumber'],
    });
    if (!warehouse)
      throw new HttpException(
        this.errorsService.notFoundWarehouse(),
        HttpStatus.NOT_FOUND,
      );
    return {
      data: warehouse,
    };
  }

  async rateWarehouse(body: RateWarehouseDto) {
    const { warehouseId, rating } = body;
    const warehouse = await this.warehouseRepository.findOne({
      where: {
        id: warehouseId,
      },
    });
    if (!warehouse)
      throw new HttpException(
        this.errorsService.notFoundWarehouse(),
        HttpStatus.NOT_FOUND,
      );
    warehouse.rating =
      (warehouse.rating * warehouse.rateCount + rating) /
      (warehouse.rateCount + 1);
    warehouse.rateCount++;
    await this.warehouseRepository.save(warehouse);
    return {
      data: {
        id: warehouse.id,
      },
    };
  }
}
