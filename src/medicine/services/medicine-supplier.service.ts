import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Category,
  Medicine,
  MedicineDetails,
} from '../entities/medicine.entities';
import { Not, Repository } from 'typeorm';

import { MedicineError } from './medicine-error.service';
import { CreateMedicine } from '../api/dto/create-medicine.dto';
import { IUser } from 'src/shared/interface/user.interface';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { CreateMedicineBrew } from '../api/dto/create-medicine-brew.dto';
import { GetByIdMedicineSupplier } from '../api/response/get-by-id-medicine-supplier.dto';
import { IParams } from 'src/shared/interface/params.interface';
import { GetAllMedicinesSupplier } from '../api/response/get-all-medicine-supplier.dto copy';
import {
  SupplierMedicine,
  SupplierMedicineDetails,
} from '../entities/medicine-role.entities';
import { Media } from 'src/media/entities/media.entity';
import { UpdateMedicineDto } from '../api/dto/update-medicine.dto';
import { GetMedicineBathesDto } from '../api/response/get-medicine-batches.dto';

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
    @InjectRepository(SupplierMedicineDetails)
    private supplierMedicineDetails: Repository<SupplierMedicineDetails>,
    private medicineError: MedicineError,
    @InjectRepository(Media) private mediaRepository: Repository<Media>,
  ) {}

  async create(user: IUser, body: CreateMedicine) {
    const { name, description, categoryId, price, imageId } = body;
    const category = this.categoryRepository.findOne({
      where: {
        id: categoryId as number,
      },
    });
    if (!category)
      throw new HttpException(
        this.medicineError.notFoundCategory(),
        HttpStatus.NOT_FOUND,
      );
    if (imageId) {
      const image = await this.mediaRepository.findOne({
        where: {
          id: imageId as number,
        },
      });

      if (!image)
        throw new HttpException(
          this.medicineError.notFoundImage(),
          HttpStatus.NOT_FOUND,
        );
    }

    //* creating for medicine table
    const medicine = new Medicine();
    medicine.description = description;
    medicine.name = name;
    medicine.category = categoryId as Category;
    if (imageId) medicine.image = imageId as Media;
    medicine.supplier = user.supplierId as Supplier;

    //* creating for supplier medicine table
    const supplierMedicine = new SupplierMedicine();
    supplierMedicine.medicine = medicine;
    supplierMedicine.price = price;
    supplierMedicine.supplier = user.supplierId as Supplier;

    await this.medicineRepository.save(medicine);
    await this.supplierMedicineRepository.save(supplierMedicine);
    return {
      data: {
        id: supplierMedicine.id,
      },
    };
  }

  async update(id: number, body: UpdateMedicineDto, user: IUser) {
    const { imageId, categoryId, price, description } = body;
    const { supplierId } = user;
    const medicine = await this.supplierMedicineRepository.findOne({
      where: {
        id,
        supplier: {
          id: supplierId as number,
        },
      },
      relations: {
        medicine: {
          image: true,
          category: true,
        },
      },
    });
    if (!medicine) {
      throw new HttpException(
        this.medicineError.notFoundMedicine(),
        HttpStatus.BAD_REQUEST,
      );
    }
    if (imageId) medicine.medicine.image = imageId as Media;
    if (categoryId) medicine.medicine.category = categoryId as Category;
    if (price) medicine.price = price;
    if (description) medicine.medicine.description = description;
    const updatedMedicine = await this.supplierMedicineRepository.save(
      medicine,
    );
    return {
      data: {
        id: updatedMedicine.id,
      },
    };
  }

  async findMedicineBatches(medicineId: number, user: IUser) {
    const { supplierId } = user;
    const batches = await this.supplierMedicineDetails.find({
      where: {
        medicine: {
          id: medicineId,
          supplier: {
            id: supplierId as number,
          },
          quantity: Not(0),
        },
      },
      select: {
        medicineDetails: {
          startDate: true,
          endDate: true,
        },
      },
      relations: {
        medicineDetails: true,
      },
    });
    return {
      data: batches.map((batch) =>
        new GetMedicineBathesDto({ batch }).toObject(),
      ),
    };
  }
  async findAll({ criteria, pagination }, user: IUser) {
    const { skip, limit } = pagination;
    const { supplierId } = user;
    const totalRecords = await this.supplierMedicineRepository.count({
      where: {
        ...criteria,
        supplier: {
          id: supplierId,
        },
        quantity: Not(0),
      },
    });
    const medicines = await this.supplierMedicineRepository
      .createQueryBuilder('supplier_medicine')
      .leftJoinAndSelect('supplier_medicine.supplier', 'supplier')
      .leftJoinAndSelect('supplier_medicine.medicine', 'medicine')
      .leftJoinAndSelect('medicine.category', 'category')
      .where('supplier.id = :id', { id: supplierId as number })
      .andWhere('supplier_medicine.quantity > 0')
      .leftJoinAndSelect('medicine.image', 'image')
      .select([
        'supplier.id',
        'supplier_medicine.id',
        'supplier_medicine.price',
        'supplier_medicine.quantity',
        'medicine.id',
        'medicine.name',
        'category.category',
        'image.id',
        'image.url',
      ])
      .take(limit)
      .skip(skip)
      .getMany();

    return {
      totalRecords,
      data: medicines.map((medicine) =>
        new GetAllMedicinesSupplier({ supplierMedicine: medicine }).toObject(),
      ),
    };
  }

  async findOne(id: number, user: IUser) {
    const medicine = await this.supplierMedicineRepository.findOne({
      where: {
        id,
        supplier: { id: user.supplierId as number },
        quantity: Not(0),
        medicineDetails: {
          quantity: Not(0),
        },
      },
      relations: {
        medicine: {
          category: true,
          image: true,
          supplier: true,
        },
        medicineDetails: {
          medicineDetails: true,
        },
      },
      select: {
        medicine: {
          name: true,
          category: { category: true },
          image: { id: true, url: true },
          supplier: {
            name: true,
          },
          description: true,
        },
        id: true,
        price: true,
        quantity: true,
      },
    });
    if (!medicine) {
      throw new HttpException(
        this.medicineError.notFoundMedicine(),
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      data: new GetByIdMedicineSupplier({
        supplierMedicine: medicine,
      }).toObject(),
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
        supplierMedicine: {
          id: medicineId,
        },
        supplier: {
          id: supplierId as number,
        },
      },
    });

    const supplierMedicine = await this.supplierMedicineRepository.findOne({
      where: {
        id: medicineId,
        supplier: {
          id: supplierId as number,
        },
      },
    });
    if (!medicine || !supplierMedicine)
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

    const medicineSupplierBrew = this.supplierMedicineDetails.create({
      medicine: supplierMedicine,
      quantity,
      medicineDetails: medicineBrew,
    });
    await this.supplierMedicineDetails.save(medicineSupplierBrew);

    await this.supplierMedicineRepository.update(
      {
        id: medicineId,
      },
      {
        quantity: supplierMedicine.quantity + quantity,
      },
    );
    return {
      data: {
        id: medicineSupplierBrew.id,
      },
    };
  }
}
