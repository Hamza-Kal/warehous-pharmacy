import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PharmacyComplaint,
  SupplierComplaint,
  WarehouseComplaint,
} from '../entities/role-complaint.entities';
import { Repository } from 'typeorm';
import { GetAllSuppliersComplaintsDto } from '../api/dtos/response/get-all-supplier-complaints.dto';
import { GetAllPharmaciesComplaintsDto } from '../api/dtos/response/get-all-pharmacies-complaints.dto';
import { GetAllWarehouseSupplierComplaintsDto } from '../api/dtos/response/get-all-warehouseSupplier-complaints.dto';
import { GetAllWarehousePharmacyComplaintsDto } from '../api/dtos/response/get-all-warehousePharmacy-complaints.dto';
import { Not, IsNull } from 'typeorm';
@Injectable()
export class ComplaintAdminService {
  constructor(
    @InjectRepository(SupplierComplaint)
    private supplierComplaintRepository: Repository<SupplierComplaint>,
    @InjectRepository(PharmacyComplaint)
    private pharmacyComplaintRepository: Repository<PharmacyComplaint>,
    @InjectRepository(WarehouseComplaint)
    private warehouseComplaintRepository: Repository<WarehouseComplaint>,
  ) {}

  async getAllSuppliersComplaints() {
    const complaints = await this.supplierComplaintRepository.find({
      relations: {
        supplier: true,
        complaintedWarehouse: true,
      },
      select: {
        supplier: {
          name: true,
        },
        complaintedWarehouse: {
          name: true,
        },
      },
    });
    return {
      data: complaints.map((supplierComplaint) =>
        new GetAllSuppliersComplaintsDto({ supplierComplaint }).toObject(),
      ),
    };
  }

  async getAllPharmaciesComplaints() {
    const complaints = await this.pharmacyComplaintRepository.find({
      relations: {
        pharmacy: true,
        complaintedWarehouse: true,
      },
      select: {
        pharmacy: {
          name: true,
        },
        complaintedWarehouse: {
          name: true,
        },
      },
    });
    return {
      data: complaints.map((pharmacyComplaint) =>
        new GetAllPharmaciesComplaintsDto({ pharmacyComplaint }).toObject(),
      ),
    };
  }

  async getAllWarehouseSupplierComplaints() {
    const complaints = await this.warehouseComplaintRepository.find({
      where: {
        complaintedSupplier: Not(IsNull()),
      },
      relations: {
        warehouse: true,
        complaintedSupplier: true,
      },
      select: {
        warehouse: {
          name: true,
        },
        complaintedSupplier: {
          name: true,
        },
      },
    });
    return {
      data: complaints.map((warehouseSupplierComplaint) =>
        new GetAllWarehouseSupplierComplaintsDto({
          warehouseSupplierComplaint,
        }).toObject(),
      ),
    };
  }

  async getAllWarehousePharmacyComplaints() {
    const complaints = await this.warehouseComplaintRepository.find({
      where: {
        complaintedPharmacy: Not(IsNull()),
      },
      relations: {
        warehouse: true,
        complaintedPharmacy: true,
      },
      select: {
        warehouse: {
          name: true,
        },
        complaintedPharmacy: {
          name: true,
        },
      },
    });
    return {
      data: complaints.map((warehousePharmacyComplaint) =>
        new GetAllWarehousePharmacyComplaintsDto({
          warehousePharmacyComplaint,
        }).toObject(),
      ),
    };
  }
}
