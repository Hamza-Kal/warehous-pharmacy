import { Role } from 'src/enums/roles';
import { Bcrypt } from 'src/utils/bcrypt';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 64,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 64,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 64,
  })
  fullName: string;

  @Column({
    type: 'varchar',
    length: 64,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @Column({
    type: 'boolean',
    default: false,
  })
  isApproved: boolean;

  @BeforeInsert()
  async logInsert() {
    this.password = await Bcrypt.hashPassword(this.password);
  }

  @AfterInsert()
  logAfterInsert() {
    console.log('user with id %d inserted', this.id);
  }
  @AfterUpdate()
  logUpdate() {
    console.log('user with id %d updated', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('user with id %d removed', this.id);
  }
}
