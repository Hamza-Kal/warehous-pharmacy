import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from '../entities/supplier.entity';
import { Repository } from 'typeorm';
import { GetAllSuppliers } from 'src/warehouse/api/dto/response/get-all-suppliers.dto';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { IUser } from 'src/shared/interface/user.interface';
import { MedicineService } from 'src/medicine/services/medicine.service';
import { GetBrewsMedicineDto } from '../api/response/get-brews-medicine.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    private medicinesService: MedicineService,
  ) {}
  async findAll({
    pagination,
    criteria,
  }: {
    pagination?: Pagination;
    criteria?: any;
  }) {
    // const { skip, limit } = pagination;
    const suppliers = await this.supplierRepository.find({
      where: {
        ...criteria,
      },
      select: ['id', 'location', 'name', 'phoneNumber'],
      // take: limit,
      // skip,
    });
    return {
      data: suppliers.map((supplier) =>
        new GetAllSuppliers({ supplier }).toObject(),
      ),
    };
  }
  async getBrews(medicineId: number, user: IUser) {
    const { supplierId } = user;
    const medicineBrews = await this.medicinesService.getBrewsForSupplier(
      supplierId as number,
      medicineId,
    );
    return {
      data: medicineBrews.map((brew) =>
        new GetBrewsMedicineDto({ brew }).toObject(),
      ),
    };
  }
}
