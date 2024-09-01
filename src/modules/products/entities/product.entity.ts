import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PRODUCT_TABLE } from 'src/config';

@Entity({
  name: PRODUCT_TABLE,
})
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Column({})
  @ApiProperty()
  name: string;

  @Column({
    type: 'float',
  })
  @ApiProperty()
  price: number;

  @Column({})
  @ApiProperty()
  description: string;

  @Column({ default: false })
  @ApiProperty()
  quantity: number;

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
