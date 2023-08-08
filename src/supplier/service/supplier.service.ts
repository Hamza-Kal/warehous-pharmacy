import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from '../entities/supplier.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { GetAllSuppliers } from 'src/supplier/api/response/get-all-suppliers.dto';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { IUser } from 'src/shared/interface/user.interface';
import { MedicineService } from 'src/medicine/services/medicine.service';
import { GetBrewsMedicineDto } from '../api/response/get-brews-medicine.dto';
import { GetByIdSupplier } from 'src/supplier/api/response/get-by-id-supplier.dto';
import { MedicineError } from 'src/medicine/services/medicine-error.service';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    private medicinesService: MedicineService,
    private errorsService: MedicineError,
  ) {}
  async findAll({
    pagination,
    criteria,
  }: {
    pagination?: Pagination;
    criteria?: FindOptionsWhere<Supplier> | FindOptionsWhere<Supplier>[];
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

  async findOne(id: number) {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
      select: ['id', 'location', 'name', 'phoneNumber'],
      relations: {
        user: true,
      },
    });
    if (!supplier)
      throw new HttpException(
        this.errorsService.notFoundSupplier(),
        HttpStatus.NOT_FOUND,
      );
    return {
      data: new GetByIdSupplier({ supplier }).toObject(),
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
