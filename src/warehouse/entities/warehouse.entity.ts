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
import { WarehouseOrders } from 'src/order/entities/order.entities';

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

  @OneToOne(() => User)
  @JoinColumn()
  owner: User;

  @OneToMany(() => Inventory, (inventory) => inventory.warehouse, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  inventories: Inventory[];

  @OneToMany(
    () => WarehouseOrders,
    (warehouseOrders) => warehouseOrders.warehouse,
    { onDelete: 'CASCADE' },
  )
  warehouseOrder: WarehouseOrders[];
}
