import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from '../entities/supplier.entity';
import { Repository } from 'typeorm';
import { GetAllSuppliers } from 'src/warehouse/api/dto/response/get-all-suppliers.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}
  async findAll(pagination: any, criteria: any) {
    const { skip, limit } = pagination;
    const suppliers = await this.supplierRepository.find({
      where: {
        ...criteria,
      },
      select: ['id', 'location', 'name', 'phoneNumber'],
      take: limit,
      skip,
    });
    return {
      data: suppliers.map((supplier) =>
        new GetAllSuppliers({ supplier }).toObject(),
      ),
    };
  }
}
