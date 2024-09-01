import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { PRODUCT_TABLE, USER_TABLE } from 'src/config';

export class CreateProductTable1725143531975 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: PRODUCT_TABLE,
        foreignKeys: [
          {
            name: 'user_owner_id',
            referencedTableName: USER_TABLE,
            referencedColumnNames: ['id'],
            columnNames: ['owner_id'],
          },
          {
            name: 'user_owner_id',
            referencedTableName: USER_TABLE,
            referencedColumnNames: ['id'],
            columnNames: ['reviewed_by'],
          },
        ],
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isGenerated: true,
            isPrimary: true,
            generationStrategy: 'uuid',
          },

          {
            name: 'owner_id',
            type: 'varchar',
          },

          {
            name: 'name',
            type: 'varchar',
          },

          {
            name: 'price',
            type: 'float',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'quantity',
            type: 'integer',
          },

          {
            name: 'status',
            type: 'varchar',
          },

          {
            name: 'is_approved_at',
            type: 'timestamp',
            isNullable: true,
          },

          {
            name: 'is_rejected_at',
            type: 'timestamp',
            isNullable: true,
          },

          {
            name: 'reviewed_by',
            type: 'varchar',
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
    await queryRunner.dropTable(PRODUCT_TABLE);
  }
}
