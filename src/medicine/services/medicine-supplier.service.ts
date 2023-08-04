import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Category,
  Medicine,
  MedicineDetails,
} from '../entities/medicine.entities';
import { Repository } from 'typeorm';

import { MedicineError } from './medicine-error.service';
import { CreateMedicine } from '../api/dto/create-medicine.dto';
import { IUser } from 'src/shared/interface/user.interface';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { CreateMedicineBrew } from '../api/dto/create-medicine-brew.dto';
import { GetByIdMedicineSupplier } from '../api/response/get-by-id-medicine-supplier.dto';
import { IParams } from 'src/shared/interface/params.interface';
import { GetAllMedicinesSupplier } from '../api/response/get-all-medicine-supplier.dto copy';
import { SupplierMedicine } from '../entities/medicine-role.entities';

@Injectable()
export class MedicineSupplierService {
  constructor(
    @InjectRepository(Medicine)
    private medicineRepository: Repository<Medicine>,
    @InjectRepository(SupplierMedicine)
    private supplierMedicineRepository: Repository<SupplierMedicine>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
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

    //* creating for medicine table
    const medicine = new Medicine();
    medicine.description = description;
    medicine.name = name;
    medicine.category = categoryId;
    medicine.supplier = user.supplierId as Supplier;
    medicine.price = price;

    //* creating for supplier medicine table
    const supplierMedicine = new SupplierMedicine();
    supplierMedicine.medicine = medicine;
    supplierMedicine.price = price;
    medicine.supplier = user.supplierId as Supplier;

    await this.medicineRepository.save(medicine);
    await this.supplierMedicineRepository.save(supplierMedicine);
    return {
      data: {
        id: medicine.id,
      },
    };
  }

  async findAll({ criteria, pagination }, user: IUser) {
    const { skip, limit } = pagination;
    const { supplierId } = user;
    const totalCount = await this.medicineRepository.count({
      where: {
        ...criteria,
        supplier: {
          id: supplierId,
        },
      },
    });
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
      totalCount,
      data: medicines.map((medicine) =>
        new GetAllMedicinesSupplier({ medicine }).toObject(),
      ),
    };
  }

  async findOne(id: number, user: IUser) {
    console.log(id);
    const medicine = await this.medicineRepository.findOne({
      where: { id, supplier: { id: user.supplierId as number } },
      relations: { category: true },
      select: {
        category: { category: true },
        name: true,
        id: true,
        price: true,
        quantity: true,
      },
    });
    if (!medicine) {
      throw new HttpException(
        this.medicineError.notFoundMedicine(),
        HttpStatus.BAD_GATEWAY,
      );
    }
    return { data: new GetByIdMedicineSupplier({ medicine }).toObject() };
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
      quantity,
    });
    await this.medicineDetails.save(medicineBrew);
    await this.medicineRepository.update(
      {
        id: medicineId,
      },
      {
        quantity: medicine.quantity + quantity,
      },
    );
    return {
      data: {
        id: medicineBrew.id,
      },
    };
  }
}
