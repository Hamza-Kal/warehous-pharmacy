import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Medicine {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar", length: 50 })
  name: string;
}
