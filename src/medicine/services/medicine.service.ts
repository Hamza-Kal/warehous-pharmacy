import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Category, Medicine } from '../entities/medicine.entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMedicine } from '../api/dto/create-medicine.dto';
import { MedicineError } from './medicine-error.service';
import { IUser } from '../../shared/interface/user.interface';

@Injectable()
export class MedicineWebService {
  constructor(
    @InjectRepository(Medicine)
    private medicineRepository: Repository<Medicine>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private medicineError: MedicineError,
  ) {}

  async create(body: CreateMedicine) {
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
    await this.medicineRepository.save(medicine);
    return {
      data: {
        id: medicine.id,
      },
    };
  }
  async getSupplierMedicines({ criteria, pagination }, user: IUser) {
    const { skip, limit } = pagination;
    return this.medicineRepository.find({
      where: {
        ...criteria,
      },
      skip,
      take: limit,
    });
  }
}
