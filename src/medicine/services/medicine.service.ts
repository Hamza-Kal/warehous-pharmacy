import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  Category,
  Medicine,
  MedicineDetails,
} from '../entities/medicine.entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMedicine } from '../api/dto/create-medicine.dto';
import { MedicineError } from './medicine-error.service';
import { CreateMedicineBrew } from '../api/dto/create-medicine-brew.dto';
import { IUser } from 'src/shared/interface/user.interface';
import { SupplierMedicine } from '../entities/medicine-role.entities';

@Injectable()
export class MedicineWebService {
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
    console.log(user);
    const { name, description, categoryId } = body;
    console.log('body', body);
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category)
      throw new HttpException(
        this.medicineError.notFoundCategory(),
        HttpStatus.NOT_FOUND,
      );
    const medicine = new Medicine();
    medicine.description = description;
    medicine.name = name;
    medicine.category = category;
    medicine.supplier.id = user.supplierId;
    await this.medicineRepository.save(medicine);
    return {
      data: {
        id: medicine.id,
      },
    };
  }
  async getSupplierMedicines({ criteria, pagination }, user: IUser) {
    const { skip, limit } = pagination;
    const { supplierId } = user;
    return this.medicineRepository.find({
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
  }

  async createMeicineBrew(user: IUser, body: CreateMedicineBrew) {
    const { id } = user;
    const { medicineId, productionDate, expireDate, quantity, price } = body;
    if (productionDate.getTime() > expireDate.getTime()) {
      throw new HttpException(
        ['production date must be before expire date'],
        HttpStatus.BAD_REQUEST,
      );
    }
    const medicine = await this.medicineRepository.findOne({
      where: { id: medicineId, supplier: { id: id } },
    });
    if (!medicine)
      throw new HttpException(
        this.medicineError.notFoundMedicine(),
        HttpStatus.NOT_FOUND,
      );
    const medicineBrew = await this.medicineDetails.create({
      startDate: productionDate,
      endDate: expireDate,
      medicine,
    });
  }
}
