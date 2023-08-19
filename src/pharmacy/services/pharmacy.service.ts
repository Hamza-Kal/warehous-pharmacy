import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pharmacy } from '../entities/pharmacy.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { GetAllPharmacies } from 'src/pharmacy/api/dtos/response/get-all-pharmacies.dto';
import { GetByIdPharmacy } from '../api/dtos/response/get-by-id-pharmacy.dto';
import { MedicineError } from 'src/medicine/services/medicine-error.service';
import { AdminGetAllPharmacies } from 'src/admin/api/dto/pharmacy-dtos/find-all.dto';
import { AdminGetByIdPharmacy } from 'src/admin/api/dto/pharmacy-dtos/find-one.dto';
import { filter } from 'rxjs';

@Injectable()
export class PharmacyService {
  constructor(
    @InjectRepository(Pharmacy)
    private pharmacyRepository: Repository<Pharmacy>,
    private errorsService: MedicineError,
  ) {}

  getCriteria(queryCriteria: { name: string }) {
    let criteria: any = {};
    if (queryCriteria.name) {
      criteria = {
        ...criteria,
        name: ILike(`%${queryCriteria.name}%`),
      };
    }
    return criteria;
  }

  async findAll({
    pagination,
    criteria,
  }: {
    pagination?: Pagination;
    criteria?: FindOptionsWhere<Pharmacy> | FindOptionsWhere<Pharmacy>[];
  }) {
    const { skip, limit } = pagination;
    const pharmacies = await this.pharmacyRepository.find({
      where: {
        ...criteria,
      },
      select: ['id', 'location', 'name', 'phoneNumber'],
      take: limit,
      skip,
    });
    const totalRecords = await this.pharmacyRepository.count({
      where: {
        ...criteria,
      },
    });
    return {
      totalRecords,
      data: pharmacies.map((pharmacy) =>
        new GetAllPharmacies({ pharmacy }).toObject(),
      ),
    };
  }

  async findOne(id: number) {
    const pharmacy = await this.pharmacyRepository.findOne({
      where: { id },
      select: ['id', 'location', 'name', 'phoneNumber'],
      relations: {
        user: true,
      },
    });
    if (!pharmacy)
      throw new HttpException(
        this.errorsService.notFoundPharmacy(),
        HttpStatus.NOT_FOUND,
      );
    return {
      data: new GetByIdPharmacy({ pharmacy }).toObject(),
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

    const pharmacies = await this.pharmacyRepository.find({
      where: filteringCriteria,
      select: ['id', 'location', 'name', 'phoneNumber'],
      take: limit,
      skip,
    });
    const totalRecords = await this.pharmacyRepository.count({
      where: filteringCriteria,
    });
    return {
      totalRecords,
      data: pharmacies.map((pharmacy) =>
        new AdminGetAllPharmacies({ pharmacy }).toObject(),
      ),
    };
  }

  async AdminfindOne(id: number) {
    const pharmacy = await this.pharmacyRepository.findOne({
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
    if (!pharmacy)
      throw new HttpException(
        this.errorsService.notFoundPharmacy(),
        HttpStatus.NOT_FOUND,
      );
    return {
      data: new AdminGetByIdPharmacy({ pharmacy }).toObject(),
    };
  }
}
