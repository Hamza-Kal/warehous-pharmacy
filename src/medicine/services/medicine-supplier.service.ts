import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Category,
  Medicine,
  MedicineDetails,
} from '../entities/medicine.entities';
import { Repository } from 'typeorm';
import { SupplierMedicine } from '../entities/medicine-role.entities';
import { MedicineError } from './medicine-error.service';
import { CreateMedicine } from '../api/dto/create-medicine.dto';
import { IUser } from 'src/shared/interface/user.interface';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { CreateMedicineBrew } from '../api/dto/create-medicine-brew.dto';
import { GetAllMedicinesSupplier } from '../api/response/get-all-medicine-supplier.dto';

@Injectable()
export class MedicineSupplierService {
  constructor(
    @InjectRepository(Medicine)
    private medicineRepository: Repository<Medicine>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(SupplierMedicine)
    private supplierMedicineRepository: Repository<SupplierMedicine>,
    @InjectRepository(MedicineDetails)
    private medicineDetails: Repository<MedicineDetails>,
    private medicineError: MedicineError,
  ) {}

  async create(user: IUser, body: CreateMedicine) {
    const { name, description, categoryId, price } = body;
    if (!categoryId)
      throw new HttpException(
        this.medicineError.notFoundCategory(),
        HttpStatus.NOT_FOUND,
      );
    const medicine = new Medicine();
    medicine.description = description;
    medicine.name = name;
    medicine.category = categoryId;
    medicine.supplier = user.supplierId as Supplier;
    medicine.price = price;
    await this.medicineRepository.save(medicine);
    return {
      data: {
        id: medicine.id,
      },
    };
  }

  async findAll({ criteria, pagination }, user: IUser) {
    const { skip, limit } = pagination;
    const { supplierId } = user;
    const medicines = await this.medicineRepository.find({
      where: {
        ...criteria,
        supplier: {
          id: supplierId,
        },
      },
      relations: {
        category: true,
      },
      skip,
      take: limit,
    });
    return {
      data: medicines.map((medicine) =>
        new GetAllMedicinesSupplier({ medicine }).toObject(),
      ),
    };
  }

  async createMeicineBrew(user: IUser, body: CreateMedicineBrew) {
    const { supplierId } = user;
    const { medicineId, productionDate, expireDate, quantity } = body;
    if (productionDate.getTime() > expireDate.getTime()) {
      throw new HttpException(
        {
          code: 404,
          message: ['production date must be before expire date'],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const medicine = await this.medicineRepository.findOne({
      where: {
        id: medicineId,
        supplier: {
          id: supplierId as number,
        },
      },
    });
    if (!medicine)
      throw new HttpException(
        this.medicineError.notFoundMedicine(),
        HttpStatus.NOT_FOUND,
      );
    const medicineBrew = this.medicineDetails.create({
      startDate: productionDate,
      endDate: expireDate,
      medicine,
    });

    await this.medicineDetails.save(medicineBrew);
    const supplierMedicine = new SupplierMedicine();
    supplierMedicine.medicineDetails = medicineBrew;
    supplierMedicine.quantity = quantity;
    supplierMedicine.supplier = supplierId as Supplier;
    await this.supplierMedicineRepository.save(supplierMedicine);
    return {
      data: {
        id: medicineBrew.id,
      },
    };
  }
}
