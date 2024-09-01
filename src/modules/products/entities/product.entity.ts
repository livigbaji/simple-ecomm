import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PRODUCT_TABLE } from 'src/config';
import { ProductStatusEnum } from "../dtos/product.dto";

@Entity({
  name: PRODUCT_TABLE,
})
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Column({
    name: 'owner_id',
  })
  ownerId: string;

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

  @Column({ default: 0 })
  @ApiProperty()
  quantity: number;

  @Column({ default: ProductStatusEnum.PENDING_REVIEW })
  @ApiProperty({ enum: ProductStatusEnum })
  status: ProductStatusEnum;

  @Column({ nullable: true, name: 'reviewed_by' })
  @ApiProperty()
  reviewedBy: string;

  @Column({ nullable: true, name: 'is_approved_at' })
  @ApiProperty()
  isApprovedAt: Date;

  @Column({ nullable: true, name: 'is_rejected_at' })
  @ApiProperty()
  isRejectedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: Date;
}
