import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InventoryMedicine,
  PharmacyMedicine,
  SupplierMedicine,
  WarehouseMedicine,
  WarehouseMedicineDetails,
} from 'src/medicine/entities/medicine-role.entities';
import { Medicine } from 'src/medicine/entities/medicine.entities';
import { Repository } from 'typeorm';
export enum RepositoryEnum {
  WarehouseMedicine = 'WarehouseMedicine',
  InventoryMedicine = 'InventoryMedicine',
  SupplierMedicine = 'SupplierMedicine',
  PharmacyMedicine = 'PharmacyMedicine',
  WarehouseMedicineDetails = 'WarehouseMedicineDetails',
  InventoryMedicineDetails = 'InventoryMedicineDetails',
  SupplierMedicineDetails = 'SupplierMedicineDetails',
  PharmacyMedicineDetails = 'PharmacyMedicineDetails',
}
@Injectable()
export class DeliverService {
  constructor(
    @InjectRepository(WarehouseMedicine)
    private warehouseMedicineRepository: Repository<WarehouseMedicine>,
    @InjectRepository(InventoryMedicine)
    private inventoryMedicineRepository: Repository<InventoryMedicine>,
    @InjectRepository(SupplierMedicine)
    private supplieryMedicineRepository: Repository<SupplierMedicine>,
    @InjectRepository(PharmacyMedicine)
    private pharmacyMedicineRepository: Repository<PharmacyMedicine>,
    @InjectRepository(WarehouseMedicineDetails)
    private warehouseMedicineDetailsRepository: Repository<WarehouseMedicineDetails>,
  ) {}

  async deliverMedicine(
    role: RepositoryEnum,
    roleId: number,
    {
      medicineId,
      quantity,
    }: { medicineId: number | Medicine; quantity: number },
  ) {
    if ([RepositoryEnum.WarehouseMedicineDetails].includes(role)) {
      return;
    }
    let repo;
    let roleKey: {
      warehouse?: {
        id: number;
      };
      inventory?: {
        id: number;
      };
      supplier?: {
        id: number;
      };
      pharmacy?: {
        id: number;
      };
    };
    if (role === RepositoryEnum.WarehouseMedicine) {
      repo = this.warehouseMedicineRepository;
      roleKey = { warehouse: { id: roleId } };
    } else if (role === RepositoryEnum.InventoryMedicine) {
      repo = this.inventoryMedicineRepository;
      roleKey = { inventory: { id: roleId } };
    } else if (role === RepositoryEnum.PharmacyMedicine) {
      repo = this.pharmacyMedicineRepository;
      roleKey = { pharmacy: { id: roleId } };
    } else if (role === RepositoryEnum.SupplierMedicine) {
      repo = this.supplieryMedicineRepository;
      roleKey = { supplier: { id: roleId } };
    } else {
      return;
    }

    let medicine = await repo.findOne({
      where: {
        medicine: {
          id: medicineId as number,
        },
        ...roleKey,
      },
    });

    if (!medicine) {
      medicine = repo.create({
        quantity,
        medicine: {
          id: medicineId as number,
        },
        ...roleKey,
      });
    } else {
      medicine.quantity += quantity;
    }
    await repo.save(medicine);
    return medicine;
  }
}
