import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddForeignKeyCatalogoPaginasDeleteCascade1702671669105
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'catalogo_pagina',
      new TableForeignKey({
        name: 'FK_CATALOGO_PAGINAS',
        referencedTableName: 'catalogo',
        referencedColumnNames: ['id'],
        columnNames: ['catalogoId'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'catalogo_pagina_mapeamento',
      new TableForeignKey({
        name: 'FK_CATALOGO_PAGINA_MAPEAMENTO',
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
          name: 'FK_CATALOGO_PAGINA_MAPEAMENTO_PRODUTO',
          referencedTableName: 'catalogo_pagina_mapeamento',
          referencedColumnNames: ['id'],
          columnNames: ['catalogoPaginaMapeamentoId'],
          onDelete: 'CASCADE',
        }),
        new TableForeignKey({
          name: 'FK_CATALOGO_PAGINA_MAPEAMENTO_PRODUTO_PRODUTO',
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
