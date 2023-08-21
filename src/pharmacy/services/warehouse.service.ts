import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pharmacy } from '../entities/pharmacy.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PharmacyWarehouseService {
  constructor(
    @InjectRepository(Pharmacy)
    private pharmacyRepository: Repository<Pharmacy>,
  ) {}

  async findAllPharmacies({
    pagination,
  }: {
    pagination: { skip: number; limit: number };
  }) {
    const { skip, limit } = pagination;
    const [pharmacies, totalRecords] =
      await this.pharmacyRepository.findAndCount({
        select: ['id', 'name'],
        skip,
        take: limit,
      });
    return {
      totalRecords,
      data: pharmacies,
    };
  }
}
