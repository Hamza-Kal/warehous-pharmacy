import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IUser } from 'src/shared/interface/user.interface';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { SupplierService } from 'src/supplier/service/supplier.service';
import { WarehouseOrder } from '../entities/order.entities';
import { CreateWarehouseOrderDto } from '../api/dto/create-warehouse-order.dto';
import { MedicineService } from 'src/medicine/services/medicine.service';

@Injectable()
export class WarehouseOrderService {
  constructor(
    @InjectRepository(WarehouseOrder)
    private warehouseRepository: Repository<WarehouseOrder>,
    private userService: UserService,
    private supplierService: SupplierService,
    private readonly medicineService: MedicineService,
  ) {}

  async create(body: CreateWarehouseOrderDto, currUser: IUser) {
    // brute force

  }

  async getAllSuppliers({ pagination, criteria }) {
    return await this.supplierService.findAll(pagination, criteria);
  }
}
