import {MigrationInterface, QueryRunner, TableForeignKey} from "typeorm";

export default class CreateForeignKeyTransactionCategory1598974325819 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey('transactions', new TableForeignKey({
            name: 'TransactionCategory',
            columnNames:['category_id'],
            referencedTableName: 'categories',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('transactions','TransactionCategory');
    }

}
