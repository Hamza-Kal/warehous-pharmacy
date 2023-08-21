import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Repository } from 'typeorm';
import { SupplierComplaintWarehouseDto } from '../api/dtos/supplier-complaint.dto';
import { IUser } from 'src/shared/interface/user.interface';
import { ComplaintError } from './complaint-errors.service';
import { SupplierComplaint } from '../entities/role-complaint.entities';

@Injectable()
export class ComplaintSupplierService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    private errorsService: ComplaintError,
    @InjectRepository(SupplierComplaint)
    private supplierComplaintRepository: Repository<SupplierComplaint>,
  ) {}

  async complaintWarehouse(body: SupplierComplaintWarehouseDto, user: IUser) {
    const { warehouseId, reason } = body;
    const { supplierId } = user;
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
    const complaint = this.supplierComplaintRepository.create({
      complaintedWarehouse: warehouse,
      supplier: {
        id: supplierId as number,
      },
      reason,
    });
    await this.supplierComplaintRepository.save(complaint);
    return {
      message: 'Done :)',
    };
  }
}
