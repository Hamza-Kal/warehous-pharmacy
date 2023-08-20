import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Repository } from 'typeorm';
import { RateSupplierDto } from '../api/dto/rate-supplier.dto';
import { SupplierError } from './supplier-error.service';
import { Supplier } from '../entities/supplier.entity';

@Injectable()
export class SupplierWarehouseService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    private errorsService: SupplierError,
  ) {}

  async rateWarehouse(body: RateSupplierDto) {
    const { supplierId, rating } = body;
    const supplier = await this.supplierRepository.findOne({
      where: {
        id: supplierId,
      },
    });
    if (!supplier)
      throw new HttpException(
        this.errorsService.notFoundSupplier(),
        HttpStatus.NOT_FOUND,
      );
    supplier.rating =
      (supplier.rating * supplier.rateCount + rating) /
      (supplier.rateCount + 1);
    supplier.rateCount++;
    await this.supplierRepository.save(supplier);
    return {
      data: {
        id: supplier.id,
      },
    };
  }
}
