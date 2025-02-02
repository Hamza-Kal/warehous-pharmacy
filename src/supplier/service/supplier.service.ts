import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from '../entities/supplier.entity';
import { Admin, FindOptionsWhere, Repository } from 'typeorm';
import { GetAllSuppliers } from 'src/supplier/api/response/get-all-suppliers.dto';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { IUser } from 'src/shared/interface/user.interface';
import { MedicineService } from 'src/medicine/services/medicine.service';
import { GetBrewsMedicineDto } from '../api/response/get-brews-medicine.dto';
import { GetByIdSupplier } from 'src/supplier/api/response/get-by-id-supplier.dto';
import { MedicineError } from 'src/medicine/services/medicine-error.service';
import { AdminGetAllSuppliers } from 'src/admin/api/dto/supplier-dtos/find-all.dto';
import { AdminGetByIdSupplier } from 'src/admin/api/dto/supplier-dtos/find-one.dto';
import { ILike } from 'typeorm';
import { filter } from 'rxjs';
@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    private medicinesService: MedicineService,
    private errorsService: MedicineError,
  ) {}

  getCriteria(queryCriteria: { name?: string }) {
    let criteria: any = {};
    if (queryCriteria.name) {
      criteria = {
        ...criteria,
        name: ILike(`%${queryCriteria.name}%`),
      };
    }
    return criteria;
  }
  async findAll(criteria: { name?: string }) {
    const filteringCriteria = this.getCriteria(criteria);
    const suppliers = await this.supplierRepository.find({
      where: filteringCriteria,
      select: ['id', 'location', 'name', 'phoneNumber', 'rating'],
    });
    const totalRecords = await this.supplierRepository.count({
      where: filteringCriteria,
    });
    return {
      totalRecords,
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

  async AdminfindAll({
    pagination,
    criteria,
  }: {
    pagination?: Pagination;
    criteria?: { name: string };
  }) {
    const { skip, limit } = pagination;
    const filteringCriteria = this.getCriteria(criteria);
    const suppliers = await this.supplierRepository.find({
      where: filteringCriteria,
      select: ['id', 'location', 'name', 'phoneNumber'],
      relations: {
        user: true,
      },
      take: limit,
      skip,
    });
    const totalRecords = await this.supplierRepository.count({
      where: filteringCriteria,
    });
    return {
      totalRecords,
      data: suppliers.map((supplier) =>
        new AdminGetAllSuppliers({ supplier }).toObject(),
      ),
    };
  }

  async AdminfindOne(id: number) {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
      select: {
        id: true,
        location: true,
        phoneNumber: true,
        name: true,
        user: {
          id: true,
          email: true,
          fullName: true,
          assignedRole: true,
        },
      },
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
      data: new AdminGetByIdSupplier({ supplier }).toObject(),
    };
  }
}
