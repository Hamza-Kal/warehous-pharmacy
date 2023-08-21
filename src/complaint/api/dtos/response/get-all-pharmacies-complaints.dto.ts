import { PharmacyComplaint } from 'src/complaint/entities/role-complaint.entities';
import { Role } from 'src/shared/enums/roles';

export class GetAllPharmaciesComplaintsDto {
  id: number;
  reason: string;
  created_at: Date;
  actorName: string;
  complaintedName: string;
  actorRole: Role;
  complaintedRole: Role;
  constructor({ pharmacyComplaint }: { pharmacyComplaint: PharmacyComplaint }) {
    this.id = pharmacyComplaint.id;
    this.reason = pharmacyComplaint.reason;
    this.created_at = pharmacyComplaint.created_at;
    this.actorName = pharmacyComplaint.pharmacy.name;
    this.complaintedName = pharmacyComplaint.complaintedWarehouse.name;
    this.actorRole = Role.PHARMACY;
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
