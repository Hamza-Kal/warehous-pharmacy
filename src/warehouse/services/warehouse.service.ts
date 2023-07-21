import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Warehouse } from '../entities/warehouse.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findOne(id: number) {
    const warehouse = new Warehouse();
    warehouse.location = 'faek';
    warehouse.name = 'ffff';
    warehouse.owner = await this.userRepo.findOne({ where: { id } });
    return this.warehouseRepository.save(warehouse);

    return await this.warehouseRepository.findOne({
      where: {
        owner: {
          id,
        },
      },
    });
  }
}
