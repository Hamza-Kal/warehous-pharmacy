import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/shared/interface/user.interface';
import {
  Category,
  Medicine,
  MedicineDetails,
} from '../entities/medicine.entities';
import { Repository } from 'typeorm';
import { MedicineError } from './medicine-error.service';
import { WarehouseGetSupplierMedicines } from '../api/response/get-medicines-supplier-for-warehouse.dto';

@Injectable()
export class WarehouseMedicineService {
  constructor(
    @InjectRepository(Medicine)
    private medicineRepository: Repository<Medicine>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(MedicineDetails)
    private medicineDetails: Repository<MedicineDetails>,
    private medicineError: MedicineError,
  ) {}

  async findAll({ criteria, pagination }, supplierId: number) {
    const { skip, limit } = pagination;
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
        new WarehouseGetSupplierMedicines({ medicine }).toObject(),
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
      },
    });
    if (!medicine) {
      throw new HttpException(
        this.medicineError.notFoundMedicine(),
        HttpStatus.BAD_GATEWAY,
      );
    }
    // return { data: new GetByIdMedicineSupplier({ medicine }).toObject() };
  }
}
