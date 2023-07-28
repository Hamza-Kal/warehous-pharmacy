import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Category, Medicine } from '../entities/medicine.entities';
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

  async createMeicineBrew(user: IUser, body: CreateMedicineBrew) {
    const { medicineId, productionDate, expireDate, quantity, price } = body;
    const medicine = await this.medicineRepository.findOne({
      where: { id: medicineId },
      // relations: [supplie],
    });
    if (!medicine)
      throw new HttpException(
        this.medicineError.notFoundMedicine(),
        HttpStatus.NOT_FOUND,
      );

    // if(medicine.)
  }
}
