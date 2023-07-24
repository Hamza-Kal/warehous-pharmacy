import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pharmacy } from '../entities/pharmacy.entity';
import { Repository } from 'typeorm';
import { CreatePharmacyDto } from '../api/dtos/create-pharmacy.dto';
import { IUser } from 'src/shared/interface/user.interface';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class PharmacyWebService {
  constructor(
    @InjectRepository(Pharmacy)
    private pharmacyRepository: Repository<Pharmacy>,
    private userService: UserService,
  ) {}

  async findPharmacies() {
    return this.pharmacyRepository.find();
  }
  async findPharmacy(id: number) {
    return this.pharmacyRepository.findOne({
      where: {
        id,
      },
    });
  }
  async deletePharmacy(id: number) {
    return this.pharmacyRepository.delete(id);
  }

  async createPharmacy(body: CreatePharmacyDto, currUser: IUser) {
    const user = await this.userService.completeInfo(currUser.id);
    body.owner = user;
    const pharmacy = await this.pharmacyRepository.create(body);
    return {
      id: pharmacy.id,
    };
  }
}
