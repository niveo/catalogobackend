import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../model/base-entity';
import { CatalogoPaginaMapeamento } from './catalogo-pagina-mapeamento.entity';
import { Catalogo } from './catalogo.entity';

@Entity()
export class CatalogoPagina extends BaseEntity {
  @Column('int')
  pagina: number;

  @ManyToOne(() => Catalogo, (metadata) => metadata.paginas, {
    nullable: false,
    lazy: true,
  })
  @JoinColumn({ name: 'catalogoId', referencedColumnName: 'id' })
  catalogo: Catalogo;

  @OneToMany(
    () => CatalogoPaginaMapeamento,
    (metadata) => metadata.catalogoPagina,
    {
      lazy: true,
      onDelete: 'CASCADE',
    },
  )
  mapeamentos: CatalogoPaginaMapeamento[];
}
