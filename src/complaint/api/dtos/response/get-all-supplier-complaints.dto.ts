import { SupplierComplaint } from 'src/complaint/entities/role-complaint.entities';
import { Role } from 'src/shared/enums/roles';

export class GetAllSuppliersComplaintsDto {
  id: number;
  reason: string;
  created_at: Date;
  actorName: string;
  complaintedName: string;
  actorRole: Role;
  complaintedRole: Role;
  constructor({ supplierComplaint }: { supplierComplaint: SupplierComplaint }) {
    this.id = supplierComplaint.id;
    this.reason = supplierComplaint.reason;
    this.created_at = supplierComplaint.created_at;
    this.actorName = supplierComplaint.supplier.name;
    this.complaintedName = supplierComplaint.complaintedWarehouse.name;
    this.actorRole = Role.SUPPLIER;
    this.complaintedRole = Role.WAREHOUSE;
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
