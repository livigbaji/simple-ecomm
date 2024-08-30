import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ format: 'uuid'})
  id: string;

  @Column({
    nullable: false,
  })
  @ApiProperty()
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: false })
  isBanned: boolean

  @Column({ nullable: true })
  isBannedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
