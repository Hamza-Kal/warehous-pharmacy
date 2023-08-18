import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUser } from 'src/shared/interface/user.interface';
import { SupplierService } from 'src/supplier/service/supplier.service';
import {
  PharmacyOrder,
  PharmacyOrderDetails,
} from '../entities/order.entities';
import { CreatePharmacyOrderDto } from '../api/dto/create-warehouse-order.dto';
import { MedicineService } from 'src/medicine/services/medicine.service';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Medicine } from 'src/medicine/entities/medicine.entities';
import { OrderError } from './order-error.service';
import { Pharmacy } from 'src/pharmacy/entities/pharmacy.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(PharmacyOrder)
    private pharmacyOrderRepository: Repository<PharmacyOrder>,

    @InjectRepository(PharmacyOrderDetails)
    private pharmacyOrderDetailsRepository: Repository<PharmacyOrderDetails>,
    private supplierService: SupplierService,
    private readonly medicineService: MedicineService,
    private readonly orderError: OrderError,
  ) {}

  //! i should change the name of the function
  async findMedicineDetailsOrder(
    orderId: number,
    medicineDetailsId: number,
    quantity: number,
  ) {
    const order = await this.pharmacyOrderRepository.findOne({
      where: {
        id: orderId,
        distribution: {
          medicineDetails: {
            id: medicineDetailsId,
          },
          quantity,
        },
      },
    });

    if (!order) {
      throw new HttpException(
        this.orderError.notFoundOrder(),
        HttpStatus.NOT_FOUND,
      );
    }
    const [medicineDetails] = order.distribution;
    if (medicineDetails.quantity < quantity) {
      throw new HttpException(
        this.orderError.quantityOverTheOrderQuantity,
        HttpStatus.BAD_REQUEST,
      );
    }

    //? maybe putting dto to make it in good return shape
    return order;
  }
}
