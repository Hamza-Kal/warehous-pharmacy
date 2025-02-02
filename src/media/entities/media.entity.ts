import { Medicine } from 'src/medicine/entities/medicine.entities';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Media {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  url: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  path: string;

  @Column({
    type: 'int',
  })
  size: number;

  @Column({
    type: 'int',
  })
  height: number;

  @Column({
    type: 'int',
  })
  width: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.image, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToOne(() => Medicine, (medicine) => medicine.image)
  medicine: Medicine;
}
