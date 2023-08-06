import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InventoryMedicine,
  InventoryMedicineDetails,
  PharmacyMedicine,
  PharmacyMedicineDetails,
  SupplierMedicine,
  SupplierMedicineDetails,
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
    private supplierMedicineRepository: Repository<SupplierMedicine>,
    @InjectRepository(PharmacyMedicine)
    private pharmacyMedicineRepository: Repository<PharmacyMedicine>,
    @InjectRepository(WarehouseMedicineDetails)
    private warehouseMedicineDetailsRepository: Repository<WarehouseMedicineDetails>,
    @InjectRepository(InventoryMedicineDetails)
    private inventoryMedicineDetailsRepository: Repository<InventoryMedicineDetails>,
    @InjectRepository(SupplierMedicineDetails)
    private supplierMedicineDetailsRepository: Repository<SupplierMedicineDetails>,
    @InjectRepository(PharmacyMedicineDetails)
    private pharmacyMedicineDetailsRepository: Repository<PharmacyMedicineDetails>,
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
      repo = this.supplierMedicineRepository;
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
  async deliverMedicineDetails(
    role: RepositoryEnum,
    {
      medicineId,
      quantity,
      price,
    }: { medicineId: number | Medicine; quantity: number; price?: number },
  ) {
    if ([RepositoryEnum.WarehouseMedicineDetails].includes(role)) {
      return;
    }
    let repo;
    let roleKey: {
      lastSupplierPrice?: number;
      lastWarehousePrice?: number;
      medicine: {
        id: number;
      };
    };

    let priceObject: {
      supplierLastPrice?: number;
      warehouseLastPrice?: number;
    };
    if (role === RepositoryEnum.WarehouseMedicineDetails) {
      repo = this.warehouseMedicineDetailsRepository;
      priceObject = { supplierLastPrice: price };
      roleKey = {
        medicine: { id: medicineId as number },
      };
    } else if (role === RepositoryEnum.InventoryMedicineDetails) {
      repo = this.inventoryMedicineDetailsRepository;
      roleKey = {
        medicine: { id: medicineId as number },
      };
    } else if (role === RepositoryEnum.PharmacyMedicineDetails) {
      repo = this.pharmacyMedicineDetailsRepository;
      priceObject = { warehouseLastPrice: price };
      roleKey = {
        medicine: { id: medicineId as number },
      };
    } else if (role === RepositoryEnum.SupplierMedicineDetails) {
      repo = this.supplierMedicineDetailsRepository;
      roleKey = {
        medicine: { id: medicineId as number },
      };
    } else {
      return;
    }

    let medicine = await repo.findOne({
      where: {
        ...roleKey,
      },
    });

    if (!medicine) {
      medicine = repo.create({
        quantity,
        ...roleKey,
        ...priceObject,
      });
    } else {
      medicine.quantity += quantity;
    }
    await repo.save(medicine);
    return medicine;
  }

  async removeMedicineDetails(
    role: RepositoryEnum,
    {
      medicineId,
      medicineDetails,
      quantity,
    }: { medicineId: number; medicineDetails: number; quantity: number },
  ) {
    let repo;
    const roleKey: {
      medicineDetails: {
        id: number;
      };
      medicine: { id: number };
    } = {
      medicineDetails: {
        id: medicineDetails,
      },
      medicine: { id: medicineId as number },
    };
    console.log(roleKey);
    if (role === RepositoryEnum.WarehouseMedicineDetails) {
      repo = this.warehouseMedicineDetailsRepository;
    } else if (role === RepositoryEnum.InventoryMedicineDetails) {
      repo = this.inventoryMedicineDetailsRepository;
    } else if (role === RepositoryEnum.PharmacyMedicineDetails) {
      repo = this.pharmacyMedicineDetailsRepository;
    } else if (role === RepositoryEnum.SupplierMedicineDetails) {
      repo = this.supplierMedicineDetailsRepository;
    } else {
      return;
    }

    const medicienDetailsRow = await repo.findOne({
      where: {
        ...roleKey,
      },
    });
    console.log(medicienDetailsRow);
    if (medicienDetailsRow.quantity < quantity) {
      return;
    }
    medicienDetailsRow.quantity -= quantity;
    await repo.save(medicienDetailsRow);
  }
}
