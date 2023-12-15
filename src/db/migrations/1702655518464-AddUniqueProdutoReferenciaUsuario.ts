import { MigrationInterface, QueryRunner, TableUnique } from 'typeorm';

export class AddUniqueProdutoReferenciaUsuario1702655518464
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const produtoUniqueConstraint = new TableUnique({
      name: 'UNQ_REFERENCIA_USUARIO',
      columnNames: ['referencia', 'userId'],
    });
    await queryRunner.createUniqueConstraint(
      'produto',
      produtoUniqueConstraint,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {
    return Promise.resolve();
  }
}
