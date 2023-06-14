import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInventoryDto } from './dtos/create-inventory.dto';
import { Inventory } from './entities/inventory.entity';
import { UpdateInventoryDto } from './dtos/update-inventory.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory) private repo: Repository<Inventory>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const user = this.repo.findOneBy({ id });
    if (!user) throw new Error('there is no user with such id');
    return user;
  }

  async create(data: CreateInventoryDto) {
    const { name } = data;
    const inventory = await this.repo.findOneBy({ name });
    if (inventory)
      throw new BadRequestException(
        'there is already inventory with this name',
      );
    const createdInventory = this.repo.create(data);
    return this.repo.save(createdInventory);
  }

  async update(id: number, data: UpdateInventoryDto) {
    const inventory = await this.repo.findOneBy({ id });
    if (!inventory)
      throw new NotFoundException('there are no inventory with the given id');
    const createdInventory = this.repo.create(data);
    return this.repo.save(createdInventory);
  }
}
