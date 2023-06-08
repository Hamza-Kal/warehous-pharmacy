import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse) private repo: Repository<Warehouse>,
  ) {}
  async getAll() {
    return this.repo.findAndCount();
  }
  async create(body: any) {
    const wareHouse = await this.repo.findOneBy({ name: body.name });
    if (wareHouse)
      throw new BadRequestException('there is warehouse with this name');
    const createdWareHouse = this.repo.create(body);
    return this.repo.save(createdWareHouse);
  }
}
