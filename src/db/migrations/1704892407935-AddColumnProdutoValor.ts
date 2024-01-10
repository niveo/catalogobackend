import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnProdutoValor1704892407935 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'produto',
      new TableColumn({
        name: 'valor',
        default: 0,
        type: 'decimal',
      }),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {
    return Promise.resolve();
  }
}
