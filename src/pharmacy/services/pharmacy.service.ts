import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pharmacy } from '../entities/pharmacy.entity';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { GetAllPharmacies } from 'src/pharmacy/api/dtos/response/get-all-pharmacies.dto';
import { GetByIdPharmacy } from '../api/dtos/response/get-by-id-pharmacy.dto';
import { MedicineError } from 'src/medicine/services/medicine-error.service';

@Injectable()
export class PharmacyService {
  constructor(
    @InjectRepository(Pharmacy)
    private pharmacyRepository: Repository<Pharmacy>,
    private errorsService: MedicineError,
  ) {}
  async findAll({
    pagination,
    criteria,
  }: {
    pagination?: Pagination;
    criteria?: FindOptionsWhere<Pharmacy> | FindOptionsWhere<Pharmacy>[];
  }) {
    // const { skip, limit } = pagination;
    const suppliers = await this.pharmacyRepository.find({
      where: {
        ...criteria,
      },
      select: ['id', 'location', 'name', 'phoneNumber'],
      // take: limit,
      // skip,
    });
    return {
      data: suppliers.map((pharmacy) =>
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
}
