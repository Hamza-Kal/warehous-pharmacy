import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Category,
  Medicine,
  MedicineDetails,
} from '../entities/medicine.entities';
import { In, Repository } from 'typeorm';
import { SupplierMedicine } from '../entities/medicine-role.entities';
import { MedicineError } from './medicine-error.service';
import { CreateMedicine } from '../api/dto/create-medicine.dto';
import { IUser } from 'src/shared/interface/user.interface';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { CreateMedicineBrew } from '../api/dto/create-medicine-brew.dto';
import { GetByIdMedicineSupplier } from '../api/response/get-by-id-medicine-supplier.dto';
import { IParams } from 'src/shared/interface/params.interface';
import { GetAllMedicinesSupplier } from '../api/response/get-all-medicine-supplier.dto copy';

@Injectable()
export class MedicineService {
  constructor(
    @InjectRepository(SupplierMedicine)
    private supplierMedicineRepository: Repository<SupplierMedicine>,
    @InjectRepository(MedicineDetails)
    private medicineDetails: Repository<MedicineDetails>,
    private medicineError: MedicineError,
  ) {}

  async checkMedicine(medicineIds: number[], supplierId: number) {
    const medicines = await this.supplierMedicineRepository.find({
      where: { id: In(medicineIds) },
    });
  }
}
