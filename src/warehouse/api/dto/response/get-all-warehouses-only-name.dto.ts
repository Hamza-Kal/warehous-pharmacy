import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

export class GetAllWarehousesForSupplierDto {
  id: number;
  name: string;

  constructor({ warehouse }: { warehouse: Warehouse }) {
    this.id = warehouse.id;
    this.name = warehouse.name;
  }

  toObject(): {
    id: number;
    name: string;
  } {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
