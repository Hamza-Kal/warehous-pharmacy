import { WarehouseComplaint } from 'src/complaint/entities/role-complaint.entities';
import { Role } from 'src/shared/enums/roles';

export class GetAllWarehouseSupplierComplaintsDto {
  id: number;
  reason: string;
  created_at: Date;
  actorName: string;
  complaintedName: string;
  actorRole: Role;
  complaintedRole: Role;
  constructor({
    warehouseSupplierComplaint,
  }: {
    warehouseSupplierComplaint: WarehouseComplaint;
  }) {
    this.id = warehouseSupplierComplaint.id;
    this.reason = warehouseSupplierComplaint.reason;
    this.created_at = warehouseSupplierComplaint.created_at;
    this.actorName = warehouseSupplierComplaint.warehouse.name;
    this.complaintedName = warehouseSupplierComplaint.complaintedSupplier.name;
    this.actorRole = Role.WAREHOUSE;
    this.complaintedRole = Role.SUPPLIER;
  }

  toObject(): {
    id: number;
    reason: string;
    created_at: Date;
    actorName: string;
    complaintedName: string;
    actorRole: Role;
    complaintedRole: Role;
  } {
    return {
      id: this.id,
      reason: this.reason,
      created_at: this.created_at,
      actorName: this.actorName,
      complaintedName: this.complaintedName,
      actorRole: this.actorRole,
      complaintedRole: this.complaintedRole,
    };
  }
}
