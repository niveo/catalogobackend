import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';
import { v4 } from 'uuid';

export class AddForeignKeyCatalogoPaginasDeleteCascade1702671669105
  implements MigrationInterface
{
  private async criarFk(
    queryRunner: QueryRunner,
    tabela: string,
    tabelaReferencia: string,
    camposReferencia: string[],
    campos: string[],
    onDelete: 'CASCADE' | 'RESTRICT' = 'CASCADE',
  ) {
    const tabelaExiste = await queryRunner.getTable(tabela);
    if (tabelaExiste) {
      await queryRunner.createForeignKey(
        tabela,
        new TableForeignKey({
          name: 'FK_' + v4().replaceAll('-', ''),
          referencedTableName: tabelaReferencia,
          referencedColumnNames: camposReferencia,
          columnNames: campos,
          onDelete: onDelete,
        }),
      );
    }
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.criarFk(
      queryRunner,
      'catalogo_pagina',
      'catalogo',
      ['id'],
      ['catalogoId'],
    );

    await this.criarFk(
      queryRunner,
      'catalogo_pagina_mapeamento',
      'catalogo_pagina',
      ['id'],
      ['catalogoPaginaId'],
    );

    await this.criarFk(
      queryRunner,
      'catalogo_pagina_mapeamento_produtos_produto',
      'catalogo_pagina_mapeamento',
      ['id'],
      ['catalogoPaginaMapeamentoId'],
    );

    await this.criarFk(
      queryRunner,
      'catalogo_pagina_mapeamento_produtos_produto',
      'produto',
      ['id'],
      ['produtoId'],
      'RESTRICT',
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {
    return Promise.resolve();
  }
}
