import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { USER_TABLE } from '../config';

export class CreateUserTable1725142893807 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: USER_TABLE,
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isGenerated: true,
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },

          {
            name: 'is_admin',
            type: 'boolean',
            default: false,
          },

          {
            name: 'is_banned',
            type: 'boolean',
            default: false,
          },

          {
            name: 'is_banned_at',
            type: 'timestamp',
            isNullable: true,
          },

          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(USER_TABLE);
  }
}
