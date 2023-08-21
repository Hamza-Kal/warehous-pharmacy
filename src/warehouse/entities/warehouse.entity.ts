import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import {
  PharmacyOrder,
  WarehouseOrder,
} from 'src/order/entities/order.entities';
import { WarehouseMedicine } from 'src/medicine/entities/medicine-role.entities';
import { WarehouseReturnOrder } from 'src/return order/entities/returnOrder.entities';
import {
  PharmacyComplaint,
  SupplierComplaint,
  WarehouseComplaint,
} from 'src/complaint/entities/role-complaint.entities';

@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  location: string;

  @Column({
    type: 'float',
    precision: 2,
    default: 0,
  })
  rating: number;

  @Column({
    type: 'int',
    default: 0,
  })
  rateCount: number;

  @Column({
    type: 'varchar',
    length: 16,
  })
  phoneNumber: string;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToOne(() => User, (user) => user.warehouse)
  @JoinColumn()
  owner: User;

  // ******************** Inventory ********************

  @OneToMany(() => Inventory, (inventory) => inventory.warehouse)
  @JoinColumn()
  inventories: Inventory[];

  // ******************** Medicines ********************

  @OneToMany(() => WarehouseMedicine, (medicines) => medicines.warehouse)
  medicines: WarehouseMedicine[];

  // ******************** Order ********************

  // ******************** Warehouse ********************
  @OneToMany(
    () => WarehouseOrder,
    (warehouseOrders) => warehouseOrders.warehouse,
    {
      onDelete: 'CASCADE',
    },
  )
  warehouseOrder: WarehouseOrder[];

  @OneToMany(
    () => WarehouseReturnOrder,
    (warehouseOrders) => warehouseOrders.warehouse,
  )
  returnOrder: WarehouseReturnOrder[];

  // ******************** Pharmacy ********************

  @OneToMany(() => PharmacyOrder, (pharmacyOrder) => pharmacyOrder.warehouse, {
    onDelete: 'CASCADE',
  })
  pharmacyOrder: PharmacyOrder[];

  // @OneToMany(
  //   () => PharmacyReturnOrder,
  //   (pharmacyOrder) => pharmacyOrder.warehouse,
  //   {
  //     onDelete: 'CASCADE',
  //   },
  // )
  // pharmacyReturnOrder: PharmacyReturnOrder[];

  // ********************** Complaints **************** //

  @OneToMany(() => WarehouseComplaint, (complaint) => complaint.warehouse)
  complaints: WarehouseComplaint[];

  @OneToMany(
    () => PharmacyComplaint,
    (pharmacyComplaint) => pharmacyComplaint.complaintedWarehouse,
  )
  recievedPharmacyComplaints: PharmacyComplaint[];

  @OneToMany(() => SupplierComplaint, (complaint) => complaint.supplier)
  recievedSupplierComplaints: SupplierComplaint[];
}
