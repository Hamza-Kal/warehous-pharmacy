import { Injectable } from '@nestjs/common';
import { InventoryService } from 'src/inventory/services/inventory.service';
import { PharmacyService } from 'src/pharmacy/services/pharmacy.service';
import { SupplierService } from 'src/supplier/service/supplier.service';
import { GetAllSuppliers } from 'src/supplier/api/response/get-all-suppliers.dto';
import { WarehouseService } from 'src/warehouse/services/warehouse.service';
import { GetByIdSupplier } from 'src/supplier/api/response/get-by-id-supplier.dto';
import { abort } from 'process';

@Injectable()
export class AdminService {
  constructor(
    private supplierService: SupplierService,
    private warehouseService: WarehouseService,
    private inventoryService: InventoryService,
    private pharmacyService: PharmacyService,
  ) {}
  async findAllSuppliers({ pagination, criteria }) {
    const suppliers = await this.supplierService.findAll({
      pagination,
      criteria,
    });
    return suppliers;
  }
  async findAllWarehousehouses({ pagination, criteria }) {
    const warehouses = await this.warehouseService.findAll({
      pagination,
      criteria,
    });
    return warehouses;
  }
  async findAllInventories({ pagination, criteria }) {
    const inventories = await this.inventoryService.findAll({
      pagination,
      criteria,
    });
    return inventories;
  }
  async findAllPharmacies({ pagination, criteria }) {
    const pharmacies = await this.pharmacyService.findAll({
      pagination,
      criteria,
    });
    return pharmacies;
  }

  async findOneSupplier(id: number) {
    const supplier = await this.supplierService.findOne(id);
    return supplier;
  }

  async findOneWarehouse(id: number) {
    const warehouse = await this.supplierService.findOne(id);
    return warehouse;
  }

  async findOneInventory(id: number) {
    const inventory = await this.supplierService.findOne(id);
    return inventory;
  }

  async findOnePharmacy(id: number) {
    const pharmacy = await this.supplierService.findOne(id);
    return pharmacy;
  }
}
