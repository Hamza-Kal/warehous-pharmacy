import { Role } from "src/enums/roles";
import { Bcrypt } from "src/utils/bcrypt";
import {
  AfterInsert,
  AfterUpdate,
  BeforeInsert,
  BeforeRemove,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: "int",
  })
  id: number;

  @Column({
    type: "varchar",
    length: 64,
    unique: true,
  })
  email: string;

  @Column({
    type: "varchar",
    length: 64,
  })
  password: string;

  @Column({
    type: "varchar",
    length: 64,
    unique: true,
  })
  username: string;

  @Column({
    type: "varchar",
    length: 64,
  })
  fullName: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.GUEST,
  })
  role: Role;

  @BeforeInsert()
  async logBeforeInsert() {
    this.password = await Bcrypt.hashPassword(this.password);
  }

  @AfterInsert()
  logAfterInsert() {
    console.log("user with id %d inserted", this.id);
  }

  @BeforeUpdate()
  async logBeforeUpdate() {
    this.password = await Bcrypt.hashPassword(this.password);
  }

  @AfterUpdate()
  logAfterUpdate() {
    console.log("user with id %d updated", this.id);
  }

  @BeforeRemove()
  logBeforeRemove() {
    console.log("user with id %d removed", this.id);
  }
}
