import { Injectable } from '@nestjs/common';
import { InventoryService } from 'src/inventory/services/inventory.service';
import { PharmacyService } from 'src/pharmacy/services/pharmacy.service';
import { SupplierService } from 'src/supplier/service/supplier.service';
import { GetAllSuppliers } from 'src/supplier/api/response/get-all-suppliers.dto';
import { WarehouseService } from 'src/warehouse/services/warehouse.service';
import { GetByIdSupplier } from 'src/supplier/api/response/get-by-id-supplier.dto';
import { abort } from 'process';
import { MedicineError } from 'src/medicine/services/medicine-error.service';
import { Pagination } from 'src/shared/pagination/pagination.validation';
import { FindOptionsWhere } from 'typeorm';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

@Injectable()
export class AdminService {
  constructor(
    private supplierService: SupplierService,
    private warehouseService: WarehouseService,
    private inventoryService: InventoryService,
    private pharmacyService: PharmacyService,
    private errorService: MedicineError,
  ) {}
  async findAllSuppliers({
    pagination,
    criteria,
  }: {
    pagination?: Pagination;
    criteria?: FindOptionsWhere<Supplier> | FindOptionsWhere<Supplier>[];
  }) {
    const suppliers = await this.supplierService.AdminfindAll({
      pagination,
      criteria,
    });
    return suppliers;
  }
  async findAllWarehousehouses({
    pagination,
    criteria,
  }: {
    pagination?: Pagination;
    criteria?: FindOptionsWhere<Warehouse> | FindOptionsWhere<Warehouse>[];
  }) {
    const warehouses = await this.warehouseService.AdminfindAll({
      pagination,
      criteria,
    });
    return warehouses;
  }
  async findAllInventories({
    pagination,
    criteria,
  }: {
    pagination?: Pagination;
    criteria?: FindOptionsWhere<Inventory> | FindOptionsWhere<Inventory>[];
  }) {
    const inventories = await this.inventoryService.AdminfindAll({
      pagination,
      criteria,
    });
    return inventories;
  }
  async findAllPharmacies({
    pagination,
    criteria,
  }: {
    pagination?: Pagination;
    criteria?: FindOptionsWhere<Pharmacy> | FindOptionsWhere<Pharmacy>[];
  }) {
    const pharmacies = await this.pharmacyService.AdminfindAll({
      pagination,
      criteria,
    });
    return pharmacies;
  }

  async findOneSupplier(id: number) {
    const supplier = await this.supplierService.AdminfindOne(id);
    return supplier;
  }

  async findOneWarehouse(id: number) {
    const warehouse = await this.warehouseService.AdminfindOne(id);
    return warehouse;
  }

  async findOneInventory(id: number) {
    const inventory = await this.inventoryService.AdminfindOne(id);
    return inventory;
  }

  async findOnePharmacy(id: number) {
    const pharmacy = await this.pharmacyService.AdminfindOne(id);
    return pharmacy;
  }
}
