import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnTituloCatalogo1702566362149
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE catalogo ADD TITULO text;`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {
    return Promise.resolve();
  }
}
