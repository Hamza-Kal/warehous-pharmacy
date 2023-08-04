import { InventoryMedicine } from 'src/medicine/entities/medicine-role.entities';
import { User } from 'src/user/entities/user.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  location: string;

  @Column({
    type: 'varchar',
    length: 15,
  })
  phoneNumber: string;

  @OneToOne(() => User, (user) => user.inventory)
  @JoinColumn()
  manager: User;

  // ******************** Warehouse ********************

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.inventories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  warehouse: Warehouse;

  // ******************** Medicines ********************

  @OneToMany(
    () => InventoryMedicine,
    (inventoryMedicine) => inventoryMedicine.inventory,
  )
  medicines: InventoryMedicine[];
}
