import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from '../entities/supplier.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateSupplierDto } from '../api/dto/create-supplier.dto';
import { IUser } from 'src/shared/interface/user.interface';
import { UserService } from 'src/user/services/user.service';
import { Transaction } from 'sequelize';

@Injectable()
export class SupplierDashboardService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    private userService: UserService,
    private dataSource: DataSource,
  ) {}

  async createSupplier(
    currUser: IUser,
    { location, name, phoneNumber }: CreateSupplierDto,
  ) {
    const user = await this.userService.completeInfo(currUser.id);
    const supplier = new Supplier();
    supplier.location = location;
    supplier.name = name;
    supplier.phoneNumber = phoneNumber;
    supplier.user = user;
    await this.supplierRepository.save(supplier);
    return { data: { id: supplier.id } };
  }
}
