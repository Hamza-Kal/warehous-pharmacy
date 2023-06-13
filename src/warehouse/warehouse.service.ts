import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { retry } from "rxjs";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { CreateWarehouseDto } from "./dtos/create-warehouse.dto";
import { UpdateWareHouseDto } from "./dtos/update-warehouse.dto";
import { Warehouse } from "./entities/warehouse.entity";

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse) private repo: Repository<Warehouse>,
    private usersService: UserService,
  ) {}

  findAll() {
    return this.repo.find();
  }
  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async create(body: CreateWarehouseDto) {
    const { name } = body;
    const wareHouse = await this.repo.findOneBy({ name });
    if (wareHouse)
      throw new BadRequestException("there is warehouse with this name");
    const createdWareHouse = this.repo.create(body);
    return this.repo.save(createdWareHouse);
  }

  async update(id: number, body: UpdateWareHouseDto) {
    const warehouse = await this.repo.findOneBy({ id });
    if (!warehouse)
      throw new NotFoundException("there is no warehouse with this id");
    Object.assign(warehouse, body);
    return this.repo.save(warehouse);
  }

  async remove(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user)
      throw new NotFoundException("there is no user with the given id");
    return this.repo.remove(user);
  }
}
