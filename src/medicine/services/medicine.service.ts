import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Category,
  Medicine,
  MedicineDetails,
} from '../entities/medicine.entities';
import { In, Repository } from 'typeorm';
import { MedicineError } from './medicine-error.service';
import { MoveMedicineDto } from '../api/dto/update-Brew.dto';

@Injectable()
export class MedicineService {
  constructor(
    @InjectRepository(Medicine)
    private medicineRepository: Repository<Medicine>,
    @InjectRepository(MedicineDetails)
    private medicineDetailsRepository: Repository<MedicineDetails>,
    private medicineError: MedicineError,
  ) {}

  async getMedicines(
    medicineIds: number[],
    supplierId: number,
  ): Promise<Medicine[]> {
    const queries = [];

    // counting how many medicines fullfill this condition
    // here supplier id is being searched to make sure that the medicines only come from one source
    const count = await this.medicineRepository.count({
      where: { id: In(medicineIds), supplier: { id: supplierId } },
    });

    // searching for the medicines in medicines table
    for (const medicineId of medicineIds) {
      queries.push(
        this.medicineRepository.findOne({
          where: { id: medicineId, supplier: { id: supplierId } },
          select: { id: true, price: true },
        }),
      );
    }

    const medicines = await Promise.all(queries);

    // making sure the mediecines we found are match with the one we are given
    if (count - medicineIds.length || count - medicines.length) {
      throw new HttpException(
        this.medicineError.notFoundMedicine(),
        HttpStatus.BAD_REQUEST,
      );
    }

    return medicines;
  }

  async moveMedicine(dto: MoveMedicineDto) {
    const medicineDetails = await this.medicineDetailsRepository.findOneBy({
      id: dto.detailsId,
    });

    const medicine = await this.medicineRepository.findOneBy({
      id: dto.medicineId,
    });

    if (!medicineDetails || medicine) {
      throw new HttpException(
        this.medicineError.notFoundMedicine(),
        HttpStatus.BAD_REQUEST,
      );
    }

    medicine.quantity -= dto.medicineId;
    medicineDetails.quantity -= dto.quantity;

    await this.medicineDetailsRepository.save(medicineDetails);
    await this.medicineRepository.save(medicine);
  }

  async getBrewsForSupplier(supplierId: number, medicineId: number) {
    const brews = await this.medicineDetailsRepository.find({
      where: {
        medicine: {
          id: medicineId,
          supplier: {
            id: supplierId,
          },
        },
      },
    });
    return brews;
  }
}
