import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Category,
  Medicine,
  MedicineDetails,
} from '../entities/medicine.entities';
import { Not, Repository } from 'typeorm';

import { MedicineError } from './medicine-error.service';
import { IUser } from 'src/shared/interface/user.interface';
import { IParams } from 'src/shared/interface/params.interface';
import {
  InventoryMedicine,
  InventoryMedicineDetails,
} from '../entities/medicine-role.entities';
import { GetByCriteriaInventoryMedicines } from '../api/dto/reponse/inventory-get-by-criteria.dto';
import { GetByIdInventoryMedicines } from '../api/dto/reponse/inventory-get-by-id.dto';

@Injectable()
export class MedicineInventoryService {
  constructor(
    @InjectRepository(Medicine)
    private medicineRepository: Repository<Medicine>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(MedicineDetails)
    private medicineDetails: Repository<MedicineDetails>,
    @InjectRepository(InventoryMedicine)
    private inventoryMedicineRepository: Repository<InventoryMedicine>,
    @InjectRepository(InventoryMedicineDetails)
    private inventoryMedicineDetailsRepository: Repository<InventoryMedicineDetails>,
    private medicineError: MedicineError,
  ) {}

  async findAll({ criteria, pagination }, user: IUser) {
    const { skip, limit } = pagination;
    const totalRecords = await this.inventoryMedicineRepository.count({
      where: {
        ...criteria,
        inventory: {
          id: user.inventoryId,
        },
        quantity: Not(0),
      },
    });
    const medicines = await this.inventoryMedicineRepository
      .createQueryBuilder('inventory_medicine')
      .leftJoinAndSelect('inventory_medicine.inventory', 'inventory')
      .leftJoinAndSelect('inventory_medicine.medicine', 'medicine')
      .leftJoinAndSelect('medicine.category', 'category')
      .leftJoinAndSelect('medicine.image', 'image')
      .where('inventory.id = :id', { id: user.inventoryId })
      .andWhere('inventory_medicine.quantity > 0')
      .select([
        'inventory_medicine.id',
        'inventory_medicine.quantity',
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
        new GetByCriteriaInventoryMedicines({
          medicine,
        }).toObject(),
      ),
    };
  }

  async findOne({ id }: IParams, user: IUser) {
    const medicine = await this.inventoryMedicineRepository.findOne({
      where: {
        inventory: {
          id: user.inventoryId as number,
        },
        id,
        quantity: Not(0),
      },
      relations: {
        medicine: {
          warehouseMedicine: true,
          category: true,
          image: true,
        },
        medicineDetails: {
          medicineDetails: true,
        },
      },
      select: {
        id: true,
        medicine: {
          name: true,
          warehouseMedicine: {
            price: true,
          },
          category: {
            category: true,
          },
          image: {
            id: true,
            url: true,
          },
        },
        quantity: true,
        medicineDetails: {
          quantity: true,
          id: true,
          medicineDetails: {
            id: true,
            endDate: true,
          },
        },
      },
    });

    if (!medicine)
      throw new HttpException(
        this.medicineError.notFoundMedicine(),
        HttpStatus.BAD_REQUEST,
      );

    return { data: new GetByIdInventoryMedicines({ medicine }) };
  }

  async getInventoriesMedicine(medicineId: number, warehouseId: number) {
    const medicines = await this.inventoryMedicineDetailsRepository
      .createQueryBuilder('inventory_medicine_details')
      .leftJoinAndSelect(
        'inventory_medicine_details.medicine',
        'inventory_medicine',
      )
      .leftJoinAndSelect('inventory_medicine.inventory', 'inventory')
      .leftJoinAndSelect('inventory.warehouse', 'warehouse')
      .leftJoinAndSelect('inventory.manager', 'manager')
      .leftJoinAndSelect('inventory_medicine.medicine', 'medicine')
      .where('warehouse.id = :id', { id: warehouseId })
      .andWhere('inventory_medicine_details.quantity > 0', { quantity: 0 })
      .andWhere('medicine.id = :medicineId', { medicineId })
      .select([
        'inventory_medicine_details.id',
        'inventory_medicine.id',
        'medicine.id',
        'medicine.name',
        'inventory_medicine.id',
        'inventory_medicine_details.quantity',
        'inventory.name',
        'inventory.phoneNumber',
        'manager.fullName',
      ])
      .getMany();

    return medicines;
  }
}
