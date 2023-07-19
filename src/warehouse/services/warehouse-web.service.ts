import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/services/user.service';
import { DataSource, Repository } from 'typeorm';
import { CreateWarehouseDto } from '../api/dto/create-warehouse.dto';
import { UpdateWareHouseDto } from '../api/dto/update-warehouse.dto';
import { Warehouse } from '../entities/warehouse.entity';

@Injectable()
export class WarehouseWebService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    private usersService: UserService,
    private dataSource: DataSource,
  ) {}

  async getAllInventories(id: number) {
    // const queryRunner = this.dataSourc
  }
}
