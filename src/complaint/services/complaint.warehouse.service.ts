import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { WarehouseComplaint } from '../entities/role-complaint.entities';
import { ComplaintError } from './complaint-errors.service';
import { Repository } from 'typeorm';
import {
  WarehouseComplaintPharmacyDto,
  WarehouseComplaintSupplierDto,
} from '../api/dtos/warehouse-complaint.dto';
import { IUser } from 'src/shared/interface/user.interface';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';

@Injectable()
export class ComplaintWarehouseService {
  constructor(
    @InjectRepository(Pharmacy)
    private pharmacyRepository: Repository<Pharmacy>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(WarehouseComplaint)
    private warehouseComplaintRepository: Repository<WarehouseComplaint>,
    private errorsService: ComplaintError,
  ) {}

  async complaintSupplier(body: WarehouseComplaintSupplierDto, user: IUser) {
    const { supplierId, reason } = body;
    const { warehouseId } = user;
    const supplier = await this.supplierRepository.findOne({
      where: {
        id: supplierId,
      },
    });
    if (!supplier)
      throw new HttpException(
        this.errorsService.notFoundSupplier(),
        HttpStatus.NOT_FOUND,
      );
    const complaint = this.warehouseComplaintRepository.create({
      complaintedSupplier: supplier,
      warehouse: {
        id: warehouseId as number,
      },
      reason,
    });
    await this.warehouseComplaintRepository.save(complaint);
    return {
      message: 'Done :)',
    };
  }

  async complaintPharmacy(body: WarehouseComplaintPharmacyDto, user: IUser) {
    const { pharmacyId, reason } = body;
    const { warehouseId } = user;
    const pharmacy = await this.pharmacyRepository.findOne({
      where: {
        id: pharmacyId,
      },
    });
    if (!pharmacy)
      throw new HttpException(
        this.errorsService.notFoundPharmacy(),
        HttpStatus.NOT_FOUND,
      );
    const complaint = this.warehouseComplaintRepository.create({
      complaintedPharmacy: pharmacy,
      warehouse: {
        id: warehouseId as number,
      },
      reason,
    });
    await this.warehouseComplaintRepository.save(complaint);
    return {
      message: 'Done :)',
    };
  }
}
