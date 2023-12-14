import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnCatalogo1702563910974 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE catalogo ADD LOGO text;`);
    await queryRunner.query(`ALTER TABLE catalogo ADD AVATAR text;`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {
    return Promise.resolve();
  }
}
