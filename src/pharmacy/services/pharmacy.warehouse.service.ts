import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicineError } from 'src/medicine/services/medicine-error.service';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PharmacyWarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    private errorsService: MedicineError,
  ) {}

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
}
