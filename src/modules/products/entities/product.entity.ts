import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity({
  name: 'product',
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
  @ApiProperty()
  price: string;

  @Column({ default: false })
  @ApiProperty()
  description: boolean;

  @Column({ default: false })
  @ApiProperty()
  quantity: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  isApproved: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  isApprovedAt: Date;

  @Column({ nullable: true })
  @ApiProperty()
  isRejectedAt: Date;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
