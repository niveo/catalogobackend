import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from './../model/base-entity';
import { CatalogoPagina } from './catalogo-pagina.entity';
import { Produto } from './produto.entity';

@Entity()
export class CatalogoPaginaMapeamento extends BaseEntity {
  @Column('double precision', { nullable: false })
  inicialPosicalX: number;

  @Column('double precision', { nullable: false })
  finalPosicalX: number;

  @Column('double precision', { nullable: false })
  inicialPosicalY: number;

  @Column('double precision', { nullable: false })
  finalPosicalY: number;

  @Column('double precision', { nullable: false })
  width: number;

  @Column('double precision', { nullable: false })
  height: number;

  @ManyToMany(() => Produto, {
    createForeignKeyConstraints: false,
  })
  @JoinTable()
  produtos: Produto[];

  @ManyToOne(() => CatalogoPagina, (metadata) => metadata.mapeamentos, {
    createForeignKeyConstraints: false,
  })
  catalogoPagina: CatalogoPagina;
}
