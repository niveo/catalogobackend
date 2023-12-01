import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../model/base-entity';
import { CatalogoPagina } from './catalogo-pagina.entity';

@Entity()
export class CatalogoPaginaMapeamento extends BaseEntity {
  @Column('decimal')
  inicialPosicalX: number;

  @Column('decimal')
  finalPosicalX: number;

  @Column('decimal')
  inicialPosicalY: number;

  @Column('decimal')
  finalPosicalY: number;

  @Column('decimal')
  width: number;

  @Column('decimal')
  height: number;

  @ManyToOne(() => CatalogoPagina, (metadata) => metadata.mapeamentos, {
    nullable: false,
  })
  catalogoPagina: CatalogoPagina;
}
