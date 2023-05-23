import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
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

  @AfterInsert()
  logInsert() {
    console.log('user with id %d created', this.id);
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
