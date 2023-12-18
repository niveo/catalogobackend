import { randomUUID } from 'crypto';
import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddForeignKeyCatalogoPaginasDeleteCascade1702671669105
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'catalogo_pagina',
      new TableForeignKey({
        name: 'FK_' + randomUUID().replaceAll('-', ''),
        referencedTableName: 'catalogo',
        referencedColumnNames: ['id'],
        columnNames: ['catalogoId'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'catalogo_pagina_mapeamento',
      new TableForeignKey({
        name: 'FK_' + randomUUID().replaceAll('-', ''),
        referencedTableName: 'catalogo_pagina',
        referencedColumnNames: ['id'],
        columnNames: ['catalogoPaginaId'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKeys(
      'catalogo_pagina_mapeamento_produtos_produto',
      [
        new TableForeignKey({
          name: 'FK_' + randomUUID().replaceAll('-', ''),
          referencedTableName: 'catalogo_pagina_mapeamento',
          referencedColumnNames: ['id'],
          columnNames: ['catalogoPaginaMapeamentoId'],
          onDelete: 'CASCADE',
        }),
        new TableForeignKey({
          name: 'FK_' + randomUUID().replaceAll('-', ''),
          referencedTableName: 'produto',
          referencedColumnNames: ['id'],
          columnNames: ['produtoId'],
          onDelete: 'RESTRICT',
        }),
      ],
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {
    return Promise.resolve();
  }
}
