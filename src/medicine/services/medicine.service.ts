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
import {
  InventoryMedicineDetails,
  SupplierMedicine,
  SupplierMedicineDetails,
  WarehouseMedicine,
  WarehouseMedicineDetails,
} from '../entities/medicine-role.entities';
import {
  CreateMedicine,
  CreateWarehouseMedicine,
  CreateWarehouseMedicineDetails,
} from '../api/dto/create-medicine.dto';
import { CreateWarehouseDto } from 'src/warehouse/api/dto/create-warehouse.dto';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

@Injectable()
export class MedicineService {
  constructor(
    @InjectRepository(Medicine)
    private medicineRepository: Repository<Medicine>,
    @InjectRepository(MedicineDetails)
    private medicineDetailsRepository: Repository<MedicineDetails>,
    @InjectRepository(SupplierMedicine)
    private supplierMedicineRepository: Repository<SupplierMedicine>,
    @InjectRepository(WarehouseMedicine)
    private warehouseMedicineRepository: Repository<WarehouseMedicine>,
    @InjectRepository(WarehouseMedicineDetails)
    private warehouseMedicineDetailsRepository: Repository<WarehouseMedicineDetails>,
    @InjectRepository(InventoryMedicineDetails)
    private inventoryMedicineDetailsRepository: Repository<InventoryMedicineDetails>,
    @InjectRepository(SupplierMedicineDetails)
    private supplierMedicineDetailsRepository: Repository<SupplierMedicineDetails>,
    private medicineError: MedicineError,
  ) {}

  async getMedicines(
    medicineIds: number[],
    supplierId: number,
  ): Promise<SupplierMedicine[]> {
    const queries = [];

    // counting how many medicines fullfill this condition
    // here supplier id is being searched to make sure that the medicines only come from one source
    const count = await this.supplierMedicineRepository.count({
      where: {
        id: In(medicineIds),
        supplier: { id: supplierId },
      },
    });

    // searching for the medicines in medicines table
    for (const medicineId of medicineIds) {
      queries.push(
        this.supplierMedicineRepository.findOne({
          where: {
            id: medicineId,
            supplier: { id: supplierId },
          },
          relations: {
            medicine: true,
          },
          select: {
            id: true,
            price: true,
            medicine: {
              id: true,
            },
          },
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

  async findWarehouseMedicineByMedicine(id: number) {
    return await this.warehouseMedicineRepository.findOne({
      where: {
        medicine: {
          id,
        },
      },
    });
  }

  async createWarehouseMedicine(dto: CreateWarehouseMedicine) {
    let medicine = this.warehouseMedicineRepository.create({
      warehouse: dto.warehouse as Warehouse,
      medicine: dto.medicine as Medicine,
    });

    medicine = await this.warehouseMedicineRepository.save(medicine);
    return medicine;
  }

  async updateQuantity(id: number, quantity: number) {
    await this.warehouseMedicineRepository.update(
      {
        id,
      },
      {
        quantity,
      },
    );
  }

  async findWarehouseMedicineDetailsByMedicineDetails(id: number) {
    return await this.warehouseMedicineDetailsRepository.findOne({
      where: {
        medicineDetails: {
          id,
        },
      },
    });
  }

  async findInventoryMedicineDetailsByMedicineDetails(id: number) {
    return await this.inventoryMedicineDetailsRepository.findOne({
      where: {
        medicineDetails: {
          id,
        },
      },
    });
  }

  async findInventoryMedicineDetails(
    medicineDetailsId: number,
    inventoryId: number,
  ) {
    const inventoryMedicineDetails =
      await this.inventoryMedicineDetailsRepository.findOne({
        where: {
          id: medicineDetailsId,
          medicine: {
            inventory: {
              id: inventoryId as number,
            },
          },
        },
        relations: {
          medicine: {
            medicine: true,
          },
          medicineDetails: true,
        },
        select: {
          medicine: {
            id: true,
            medicine: { id: true },
          },
          id: true,
          quantity: true,
          medicineDetails: {
            id: true,
          },
        },
      });
    return inventoryMedicineDetails;
  }

  async createWarehouseMedicineDetails(dto: CreateWarehouseMedicineDetails) {
    let medicineDetails = this.warehouseMedicineDetailsRepository.create({
      medicine: dto.medicine as WarehouseMedicine,
      medicineDetails: dto.medicineDetails as MedicineDetails,
    });

    medicineDetails = await this.warehouseMedicineDetailsRepository.save(
      medicineDetails,
    );
    return medicineDetails;
  }
  async updateQuantityDetails(
    id: number,
    quantity: number,
    supplierLastPrice?: number,
  ) {
    await this.warehouseMedicineDetailsRepository.update(
      {
        id,
      },
      {
        quantity,
        supplierLastPrice,
      },
    );
  }

  async moveMedicine(dto: MoveMedicineDto) {
    const medicineDetails =
      await this.supplierMedicineDetailsRepository.findOneBy({
        id: dto.detailsId,
      });

    const medicine = await this.supplierMedicineRepository.findOneBy({
      id: dto.medicineId,
    });

    if (!medicineDetails || !medicine) {
      throw new HttpException(
        this.medicineError.notFoundMedicine(),
        HttpStatus.BAD_REQUEST,
      );
    }

    medicine.quantity -= dto.quantity;
    medicineDetails.quantity -= dto.quantity;

    await this.supplierMedicineDetailsRepository.save(medicineDetails);
    await this.supplierMedicineRepository.save(medicine);
  }

  async getBrewsForSupplier(supplierId: number, medicineId: number) {
    const brews = await this.supplierMedicineDetailsRepository.find({
      where: {
        medicine: {
          id: medicineId,
          supplier: {
            id: supplierId,
          },
        },
      },
      relations: {
        medicineDetails: true,
      },
      select: {
        medicineDetails: {
          id: true,
          startDate: true,
          endDate: true,
        },
      },
    });
    return brews;
  }

  //! do not touch this function
  // async addMedicine(
  //   medicineId: number,
  //   repository: Repository<IMedicine>,
  //   {
  //     medicine,
  //     quantity,
  //     roleKey,
  //     id,
  //   }: {
  //     medicine: Medicine;
  //     quantity: number;
  //     roleKey: roleKeys;
  //     id: any;
  //   },
  // ) {
  //   let medicines = await repository.findOne({
  //     where: {
  //       medicine: {
  //         id: medicineId,
  //       },
  //     },
  //   });
  //   if (!medicine) {
  //     medicines = repository.create({
  //       medicine,
  //       // `${mystring}`: mystring,
  //       inventory: id,
  //       quantity,
  //     });
  //     // medicine[roleKey] = id;
  //   } else {
  //     medicine.quantity += quantity;
  //   }

  //   await repository.save(medicine);
  // }
}

// export enum roleKeys {
//   inventory = 'inventoryId',
// }
