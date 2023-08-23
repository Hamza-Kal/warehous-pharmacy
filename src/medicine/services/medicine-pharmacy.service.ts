import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/shared/interface/user.interface';
import { Medicine, MedicineDetails } from '../entities/medicine.entities';
import { ILike, Not, Repository, SelectQueryBuilder } from 'typeorm';
import { MedicineError } from './medicine-error.service';
import {
  PharmacyMedicine,
  WarehouseMedicine,
} from '../entities/medicine-role.entities';
import { PharmacyGetWarehouseMedicine } from '../api/dto/response/pharmacy-get-warehouse-medicines.dto';
import { PharmacyGetByIdWarehouseMedicine } from '../api/dto/response/pharmacy-get-by-id-warehouse-medicine.dto';
import { PharmacyGetByCriteriaMedicine } from '../api/dto/response/pharmacy-get-by-criteria.dto';
import { IParams } from 'src/shared/interface/params.interface';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { PharmacyGetByCriteriaAllMedicine } from '../api/dto/response/pharmacy-get-all-medicines.dto';

@Injectable()
export class PharmacyMedicineService {
  constructor(
    @InjectRepository(WarehouseMedicine)
    private warehouseMedicineRepository: Repository<WarehouseMedicine>,
    @InjectRepository(PharmacyMedicine)
    private pharmacyMedicineRepository: Repository<PharmacyMedicine>,
    @InjectRepository(Medicine)
    private medicineRepository: Repository<Medicine>,
    @InjectRepository(MedicineDetails)
    private medicineDetails: Repository<MedicineDetails>,
    private medicineError: MedicineError,
  ) {}

  AddCriteriaPharmacyMedicine(
    dbQuery: SelectQueryBuilder<PharmacyMedicine>,
    queryParams: { name?: string; category?: string },
  ) {
    if (queryParams.name) {
      dbQuery.andWhere('medicine.name LIKE :name', {
        name: `%${queryParams.name}%`,
      });
    }
    if (queryParams.category) {
      dbQuery.andWhere('category.category = :category', {
        category: queryParams.category,
      });
    }
    return dbQuery;
  }

  AddCriteriaMedicine(
    dbQuery: SelectQueryBuilder<Medicine>,
    queryParams: { name?: string; category?: string },
  ) {
    if (queryParams.name) {
      dbQuery.andWhere('medicine.name LIKE :name', {
        name: `%${queryParams.name}%`,
      });
    }
    if (queryParams.category) {
      dbQuery.andWhere('category.category = :category', {
        category: queryParams.category,
      });
    }
    return dbQuery;
  }

  AddCriteriaWarehouseMedicine(
    dbQuery: SelectQueryBuilder<WarehouseMedicine>,
    queryParams: { name?: string; category?: string },
  ) {
    if (queryParams.name) {
      dbQuery.andWhere('medicine.name LIKE :name', {
        name: `%${queryParams.name}%`,
      });
    }
    if (queryParams.category) {
      dbQuery.andWhere('category.category = :category', {
        category: queryParams.category,
      });
    }
    return dbQuery;
  }

  async findAllWarehouse(
    {
      criteria,
      pagination,
    }: {
      pagination: Pagination;
      criteria?: { name?: string; category?: string };
    },
    warehouseId: number,
  ) {
    const { skip, limit } = pagination;
    const medicinesQuery = this.warehouseMedicineRepository
      .createQueryBuilder('warehouse_medicine')
      .leftJoinAndSelect('warehouse_medicine.warehouse', 'warehouse')
      .leftJoinAndSelect('warehouse_medicine.medicine', 'medicine')
      .leftJoinAndSelect('medicine.category', 'category')
      .leftJoinAndSelect('medicine.image', 'image')
      .where('warehouse.id = :id', { id: warehouseId as number })
      .andWhere('price != 0')
      .andWhere('quantity != 0')
      .select([
        'warehouse.id',
        'warehouse_medicine.id',
        'warehouse_medicine.price',
        'medicine.id',
        'medicine.name',
        'category.category',
        'image.url',
      ])
      .take(limit)
      .skip(skip);

    const dbQuery = this.AddCriteriaWarehouseMedicine(medicinesQuery, criteria);
    const medicines = await dbQuery.getMany();

    return {
      totalRecords: await dbQuery.getCount(),
      data: medicines.map((medicine) =>
        new PharmacyGetWarehouseMedicine({
          medicine,
        }).toObject(),
      ),
    };
  }

  async findAll({ criteria, pagination }, user: IUser) {
    const { skip, limit } = pagination;
    const medicinesQuery = this.pharmacyMedicineRepository
      .createQueryBuilder('pharmacy_medicine')
      .leftJoinAndSelect('pharmacy_medicine.pharmacy', 'pharmacy')
      .leftJoinAndSelect('pharmacy_medicine.medicine', 'medicine')
      .leftJoinAndSelect('medicine.category', 'category')
      .leftJoinAndSelect('medicine.image', 'image')
      .where('pharmacy.id = :id', { id: user.pharmacyId as number })
      .andWhere('quantity != 0')
      .select([
        'pharmacy_medicine.id',
        'pharmacy_medicine.price',
        'medicine.id',
        'medicine.name',
        'image.url',
      ])
      .take(limit)
      .skip(skip);
    const dbQuery = this.AddCriteriaPharmacyMedicine(medicinesQuery, criteria);
    const medicines = await dbQuery.getMany();

    return {
      totalRecords: await dbQuery.getCount(),
      data: medicines.map((medicine) =>
        new PharmacyGetByCriteriaMedicine({
          medicine,
        }).toObject(),
      ),
    };
  }

  async findAllMedicines({ criteria, pagination }) {
    const { skip, limit } = pagination;
    const medicinesQuery = this.medicineRepository
      .createQueryBuilder('medicine')
      .leftJoinAndSelect('medicine.category', 'category')
      .leftJoinAndSelect('medicine.image', 'image')
      .select(['medicine.id', 'medicine.name', 'image.url'])
      .take(limit)
      .skip(skip);
    const dbQuery = this.AddCriteriaMedicine(medicinesQuery, criteria);
    const medicines = await dbQuery.getMany();

    return {
      totalRecords: await dbQuery.getCount(),
      data: medicines.map((medicine) =>
        new PharmacyGetByCriteriaAllMedicine({
          medicine,
        }).toObject(),
      ),
    };
  }

  async findOne({ id }: IParams, user: IUser) {
    const medicine = await this.pharmacyMedicineRepository
      .createQueryBuilder('pharmacy_medicine')
      .leftJoinAndSelect('pharmacy_medicine.pharmacy', 'pharmacy')
      .leftJoinAndSelect('pharmacy_medicine.medicine', 'medicine')
      .leftJoinAndSelect('medicine.category', 'category')
      .leftJoinAndSelect('medicine.image', 'image')
      .where('pharmacy_medicine.id = :id', { id })
      .andWhere('pharmacy.id = :id', { id: user.pharmacyId as number })
      .select([
        'pharmacy_medicine.id',
        'pharmacy_medicine.price',
        'medicine.id',
        'medicine.name',
        'image.url',
        'category.category',
      ])
      .getOne();
    if (!medicine) {
      throw new HttpException(
        this.medicineError.notFoundMedicine(),
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      data: new PharmacyGetByCriteriaMedicine({
        medicine,
      }).toObject(),
    };
  }

  async findOneWarehouse(medicineId: number) {
    const medicine = await this.warehouseMedicineRepository
      .createQueryBuilder('warehouse_medicine')
      .leftJoinAndSelect('warehouse_medicine.warehouse', 'warehouse')
      .leftJoinAndSelect('warehouse_medicine.medicine', 'medicine')
      .leftJoinAndSelect('medicine.category', 'category')
      .leftJoinAndSelect('medicine.image', 'image')
      .where('warehouse_medicine.id = :id', { id: medicineId as number })
      .andWhere('price != 0')
      .andWhere('quantity != 0')
      .select([
        'warehouse.id',
        'warehouse_medicine.id',
        'warehouse_medicine.price',
        'warehouse_medicine.quantity',
        'medicine.id',
        'medicine.name',
        'category.category',
        'image.url',
        'medicine.description',
      ])
      .getOne();
    return {
      data: new PharmacyGetByIdWarehouseMedicine({
        medicine,
      }).toObject(),
    };
  }
}
