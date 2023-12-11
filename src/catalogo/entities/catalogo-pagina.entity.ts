import { Column, Entity, ManyToOne, OneToMany, VirtualColumn } from 'typeorm';
import { BaseEntity } from '../../model/base-entity';
import { CatalogoPaginaMapeamento } from './catalogo-pagina-mapeamento.entity';
import { Catalogo } from './catalogo.entity';

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
  })
  catalogo?: Catalogo;

  @OneToMany(
    () => CatalogoPaginaMapeamento,
    (metadata) => metadata.catalogoPagina,
    {
      onDelete: 'CASCADE',
      cascade: true,
    },
  )
  mapeamentos?: CatalogoPaginaMapeamento[];

  @VirtualColumn({
    query: (alias) =>
      `SELECT COUNT("id") FROM "catalogo_pagina_mapeamento" WHERE "catalogoPaginaId" = ${alias}.id`,
  })
  mapeados?: number = 0;
}
