import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { USER_TABLE } from '../../../config';

@Entity({
  name: USER_TABLE,
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Column({})
  @ApiProperty()
  name: string;

  @Column({
    select: false,
  })
  password: string;

  @Column({
    unique: true,
  })
  @ApiProperty({
    format: 'email',
  })
  email: string;

  @Column({ default: false, name: 'is_admin' })
  @ApiProperty()
  isAdmin: boolean;

  @Column({ default: false, name: 'is_banned' })
  isBanned: boolean;

  @Column({ nullable: true, name: 'is_banned_at' })
  isBannedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: Date;
}
