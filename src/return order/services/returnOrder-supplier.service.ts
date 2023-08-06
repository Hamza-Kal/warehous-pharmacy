import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, LessThan, Repository } from 'typeorm';
import { IUser } from 'src/shared/interface/user.interface';
import {
  ReturnOrderStatus,
  WarehouseReturnOrder,
} from '../entities/returnOrder.entities';
import { IParams } from 'src/shared/interface/params.interface';
import { MedicineService } from 'src/medicine/services/medicine.service';
import {
  WarehouseMedicine,
  WarehouseMedicineDetails,
} from 'src/medicine/entities/medicine-role.entities';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { or } from 'sequelize';

@Injectable()
export class SupplierReturnOrderService {
  constructor(
    @InjectRepository(WarehouseReturnOrder)
    private warehouseReturnOrderRepository: Repository<WarehouseReturnOrder>,
    private medicineService: MedicineService,
    private dataSource: DataSource,
  ) {}

  //? returnOrders[0] example
  //?   {
  //?     "id": 20,
  //?     "details": [
  //?         {
  //?             "quantity": 99,
  //?             "price": 247500,
  //?             "medicine": {
  //?                 "id": 15,
  //?                 "name": "vitamen c",
  //?                 "supplierMedicine": {
  //?                     "id": 23
  //?                 },
  //?                 "medicineDetails": [
  //?                     {
  //?                         "id": 32,
  //?                         "endDate": "2023-05-02",
  //?                         "supplierMedicine": {
  //?                             id: 8,
  //?                             "quantity": 2401
  //?                         }
  //?                     }
  //?                 ]
  //?             }
  //?         }
  //?     ]
  //? }
  // async acceptReturnOrder({ id }: IParams, user: IUser) {
  //   const date = new Date();
  //   const returnOrders = await this.warehouseReturnOrderRepository
  //     .createQueryBuilder('warehouse_returnOrder')
  //     .leftJoinAndSelect('warehouse_returnOrder.details', 'details')
  //     .leftJoinAndSelect('details.medicine', 'medicine')
  //     .leftJoinAndSelect('medicine.supplierMedicine', 'supplierMedicine')
  //     .leftJoinAndSelect(
  //       'medicine.medicineDetails',
  //       'medicineDetails',
  //       'medicineDetails.endDate <= :date',
  //       { date },
  //     )
  //     .leftJoinAndSelect(
  //       'medicineDetails.supplierMedicine',
  //       'supplierMedicineDetails',
  //     )
  //     .where('warehouse_returnOrder.id = :id', { id })
  //     .andWhere('warehouse_returnOrder.status = :status', {
  //       status: ReturnOrderStatus.Pending,
  //     })
  //     .andWhere('warehouse_returnOrder.supplierId = :supplierId', {
  //       supplierId: user.supplierId,
  //     })
  //     .select([
  //       'details.quantity',
  //       'details.price',
  //       'medicine.id',
  //       'warehouse_returnOrder.id',
  //       'medicine.name',
  //       'medicineDetails.id',
  //       'medicineDetails.endDate',
  //       'supplierMedicine.id',
  //       'supplierMedicineDetails.quantity',
  //       'supplierMedicineDetails.id',
  //     ])
  //     .returnOrderBy('medicineDetails.endDate', 'ASC')
  //     .getMany();

  //   if (!returnOrders.length) {
  //     throw new HttpException(
  //       this.returnOrderError.notFoundReturnOrder(),
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }

  //   const toPending = [];
  //   const removeMedicineDetails = [];
  //   //! the medicine of the returnOrder must be unique
  //   //! i should comment this
  //   //* object example is above this funcion
  //   for (const { quantity, medicine, price } of returnOrders[0].details) {
  //     let wholeQuantity = quantity;
  //     //? If the supplier didn't create the brew in the first place then it will go here
  //     if (!medicine.medicineDetails.length) {
  //       throw new HttpException(
  //         this.returnOrderError.notEnoughMedicine(),
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //     for (const { supplierMedicine, id } of medicine.medicineDetails) {
  //       //? If the supplier deleted this brew then it will be null here
  //       if (!supplierMedicine) {
  //         throw new HttpException(
  //           this.returnOrderError.notEnoughMedicine(),
  //           HttpStatus.BAD_REQUEST,
  //         );
  //       }
  //       const { quantity } = supplierMedicine;
  //       if (!wholeQuantity) break;
  //       const movedQuantity = Math.min(quantity, wholeQuantity);
  //       //* this array is stored in DistributedWarehouseReturnOrder
  //       //* id must be the id of the medicineDetailsId
  //       toPending.push({
  //         quantity: movedQuantity,
  //         id,
  //         price,
  //       });
  //       //* this elements are removed from SupplierMedicineDetails
  //       removeMedicineDetails.push({
  //         medicineId: medicine.supplierMedicine.id,
  //         detailsId: supplierMedicine.id,
  //         quantity: movedQuantity,
  //       });
  //       wholeQuantity -= movedQuantity;
  //     }

  //     //? maybe updated to status rejected
  //     if (wholeQuantity) {
  //       throw new HttpException(
  //         this.returnOrderError.notEnoughMedicine(),
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //   }

  //   //remove the medicines from the supplier medicines table
  //   for (const medicine of removeMedicineDetails) {
  //     await this.medicineService.moveMedicine(medicine);
  //   }

  //   // move the medicines to the pending table
  //   for (const medicine of toPending) {
  //     const distribution = this.warehouseDistributionRepository.create({
  //       returnOrder: returnOrders[0],
  //       quantity: medicine.quantity,
  //       medicineDetails: medicine.id,
  //       price: medicine.price,
  //     });

  //     await this.warehouseDistributionRepository.save(distribution);
  //   }

  //   // accept the returnOrder
  //   await this.warehouseReturnOrderRepository.update(
  //     {
  //       id,
  //     },
  //     {
  //       status: ReturnOrderStatus.Accepted,
  //     },
  //   );
  //   return;
  // }

  // async deliveredReturnOrder({ id }: IParams, user: IUser) {
  //   const returnOrder = await this.warehouseReturnOrderRepository.findOne({
  //     where: {
  //       id,
  //       supplier: {
  //         id: user.supplierId as number,
  //       },
  //       status: ReturnOrderStatus.Accepted,
  //     },
  //     relations: {
  //       warehouse: true,
  //       supplier: true,
  //     },
  //     select: {
  //       id: true,
  //       supplier: {
  //         id: true,
  //       },
  //       totalPrice: true,
  //       warehouse: {
  //         id: true,
  //       },
  //       status: true,
  //     },
  //   });

  //   if (!returnOrder) {
  //     throw new HttpException(
  //       this.returnOrderError.notFoundReturnOrder(),
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   returnOrder.status = ReturnOrderStatus.Delivered;

  //   const distributions = await this.warehouseDistributionRepository.find({
  //     where: { returnOrder: { id } },
  //     relations: {
  //       medicineDetails: {
  //         medicine: true,
  //       },
  //     },
  //     select: {
  //       quantity: true,
  //       price: true,
  //       medicineDetails: {
  //         id: true,
  //         medicine: {
  //           id: true,
  //         },
  //       },
  //     },
  //   });

  //   if (!distributions.length) {
  //     throw new HttpException(
  //       this.returnOrderError.notFoundDistributionError,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }

  //   const medicineId = new Set<number>();
  //   const medicineQuantity = new Map<number, number>();

  //   for (const distribution of distributions) {
  //     const { medicineDetails } = distribution;
  //     const { medicine } = medicineDetails;

  //     if (!medicineId.has(medicine.id)) {
  //       medicineQuantity.set(medicine.id, distribution.quantity);
  //       medicineId.add(medicine.id);
  //       continue;
  //     }

  //     let quantity = medicineQuantity.get(medicine.id);
  //     quantity += distribution.quantity;
  //     medicineQuantity.set(medicine.id, quantity);
  //   }

  //   //* Create the medicine to the warehouseMedicien table
  //   for (const id of medicineId) {
  //     let medicine = await this.medicineService.findWarehouseMedicineByMedicine(
  //       id,
  //     );
  //     const quantity = medicineQuantity.get(id);
  //     if (!medicine) {
  //       medicine = await this.medicineService.createWarehouseMedicine({
  //         medicine: id,
  //         warehouse: returnOrder.warehouse.id,
  //       });
  //     }

  //     await this.medicineService.updateQuantity(
  //       medicine.id,
  //       quantity + medicine.quantity,
  //     );
  //   }

  //   //* Create medicine details for warehouseMedicineDetails table
  //   for (const distribution of distributions) {
  //     let medicineDetails =
  //       await this.medicineService.findWarehouseMedicineDetailsByMedicineDetails(
  //         distribution.medicineDetails.id,
  //       );

  //     const { medicine } = distribution.medicineDetails;
  //     const warehouseMedicine =
  //       await this.medicineService.findWarehouseMedicineByMedicine(medicine.id);
  //     if (!medicineDetails) {
  //       medicineDetails =
  //         await this.medicineService.createWarehouseMedicineDetails({
  //           medicine: warehouseMedicine as WarehouseMedicine,
  //           medicineDetails: distribution.medicineDetails.id as number,
  //         });
  //     }
  //     await this.medicineService.updateQuantityDetails(
  //       medicineDetails.id,
  //       medicineDetails.quantity + distribution.quantity,
  //       distribution.price / distribution.quantity,
  //     );
  //   }

  //   await this.warehouseReturnOrderRepository.save(returnOrder);

  //   return;
  // }

  // async rejectReturnOrder({ id }: IParams, user: IUser) {
  //   const returnOrder = await this.warehouseReturnOrderRepository.findOne({
  //     where: [
  //       {
  //         id: id,
  //         supplier: {
  //           id: user.supplierId as number,
  //         },
  //         status: ReturnOrderStatus.Pending,
  //       },
  //     ],
  //   });

  //   console.log('ordrerer', returnOrder);

  //   if (!returnOrder) {
  //     throw new HttpException(
  //       this.returnOrderError.notFoundReturnOrder(),
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   returnOrder.status = ReturnOrderStatus.Rejected;
  //   await this.warehouseReturnOrderRepository.save(returnOrder);
  // }
}
