import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Repository } from 'typeorm';
import { PharmacyComplainWarehousetDto } from '../api/dtos/pharmacy-complaint-warehouse.dto';
import { IUser } from 'src/shared/interface/user.interface';
import { PharmacyComplaint } from '../entities/role-complaint.entities';
import { ComplaintError } from './complaint-errors.service';

@Injectable()
export class ComplaintPharmacyService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    @InjectRepository(PharmacyComplaint)
    private pharmacyComplaintRepository: Repository<PharmacyComplaint>,
    private errorsService: ComplaintError,
  ) {}

  async complaintWarehouse(body: PharmacyComplainWarehousetDto, user: IUser) {
    const { warehouseId, reason } = body;
    const { pharmacyId } = user;
    const warehouse = await this.warehouseRepository.findOne({
      where: {
        id: warehouseId,
      },
    });
    if (!warehouse)
      throw new HttpException(
        this.errorsService.notFoundWarehouse(),
        HttpStatus.NOT_FOUND,
      );
    const complaint = this.pharmacyComplaintRepository.create({
      complaintedWarehouse: warehouse,
      pharmacy: {
        id: pharmacyId as number,
      },
      reason,
    });
    await this.pharmacyComplaintRepository.save(complaint);
    return {
      message: 'Done :)',
    };
  }
}
