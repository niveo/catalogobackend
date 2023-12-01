import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../model/base-entity';
import { CatalogoPagina } from './catalogo-pagina.entity';

@Entity()
export class Catalogo extends BaseEntity {
  @Column('text', {
    nullable: false,
  })
  descricao: string;

  @Column('boolean', { default: false })
  ativo: boolean = false;

  @OneToMany(() => CatalogoPagina, (metadata) => metadata.catalogo, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  paginas: CatalogoPagina[];
}
