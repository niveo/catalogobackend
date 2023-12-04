import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../model/base-entity';
import { CatalogoPagina } from './catalogo-pagina.entity';
import { Transform } from 'class-transformer';
import { CatalogoDto } from '../dtos';

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

  constructor(partial: Partial<Catalogo>) {
    super();
    Object.assign(this, partial);
  }

  @Transform(() => CatalogoDto)
  toDTO(): CatalogoDto {
    return {
      id: this.id,
      descricao: this.descricao,
      ativo: this.ativo,
    };
  }
}
