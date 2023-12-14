import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnSistemaProduto1702587167519
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE catalogo ADD sistema boolean default false;`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {
    return Promise.resolve();
  }
}
