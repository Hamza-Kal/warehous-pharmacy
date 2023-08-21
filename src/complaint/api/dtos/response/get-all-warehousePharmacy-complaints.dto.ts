import {
  SupplierComplaint,
  WarehouseComplaint,
} from 'src/complaint/entities/role-complaint.entities';
import { Role } from 'src/shared/enums/roles';

export class GetAllWarehousePharmacyComplaintsDto {
  id: number;
  reason: string;
  created_at: Date;
  actorName: string;
  complaintedName: string;
  actorRole: Role;
  complaintedRole: Role;
  constructor({
    warehousePharmacyComplaint,
  }: {
    warehousePharmacyComplaint: WarehouseComplaint;
  }) {
    this.id = warehousePharmacyComplaint.id;
    this.reason = warehousePharmacyComplaint.reason;
    this.created_at = warehousePharmacyComplaint.created_at;
    this.actorName = warehousePharmacyComplaint.warehouse.name;
    this.complaintedName = warehousePharmacyComplaint.complaintedPharmacy.name;
    this.actorRole = Role.WAREHOUSE;
    this.complaintedRole = Role.PHARMACY;
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
