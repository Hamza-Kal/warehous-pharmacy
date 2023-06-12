import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NotFoundError } from "rxjs";
import { Repository } from "typeorm";
import { CreateWarehouseDto } from "./dtos/create-warehouse.dto";
import { Warehouse } from "./entities/warehouse.entity";

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse) private repo: Repository<Warehouse>,
  ) {}

  async create(body: any) {
    const { name } = body;
    const wareHouse = await this.repo.findOneBy({ name });
    if (wareHouse)
      throw new BadRequestException("there is warehouse with this name");
    const createdWareHouse = this.repo.create(body);
    return this.repo.save(createdWareHouse);
  }

  async remove(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user)
      throw new NotFoundException("there is no user with the given id");
    return this.repo.remove(user);
  }
}
