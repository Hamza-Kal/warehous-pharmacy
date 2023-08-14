import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { WarehouseOrder } from 'src/order/entities/order.entities';
import { WarehouseMedicine } from 'src/medicine/entities/medicine-role.entities';
import { WarehouseReturnOrder } from 'src/return order/entities/returnOrder.entities';

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
    type: 'varchar',
    length: 16,
  })
  phoneNumber: string;

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
}
