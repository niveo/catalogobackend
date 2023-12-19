import { Column, Entity, ManyToOne, OneToMany, VirtualColumn } from 'typeorm';
import { CatalogoPaginaMapeamento } from './catalogo-pagina-mapeamento.entity';
import { Catalogo } from './catalogo.entity';
import { BaseEntity } from './base-entity';

@Entity()
export class CatalogoPagina extends BaseEntity {
  @Column('int')
  pagina: number;

  @Column('int')
  size: number;

  @Column('int')
  height: number;

  @Column('int')
  width: number;

  @Column('text')
  name: string;

  @ManyToOne(() => Catalogo, (metadata) => metadata.paginas, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  catalogo?: Catalogo;

  @OneToMany(
    () => CatalogoPaginaMapeamento,
    (metadata) => metadata.catalogoPagina,
    {
      cascade: true,
      createForeignKeyConstraints: false,
    },
  )
  mapeamentos?: CatalogoPaginaMapeamento[];

  @VirtualColumn({
    query: (alias) =>
      `SELECT COUNT("id") FROM "catalogo_pagina_mapeamento" WHERE "catalogoPaginaId" = ${alias}.id`,
  })
  mapeados?: number = 0;
}
