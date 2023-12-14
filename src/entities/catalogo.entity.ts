import { Exclude } from 'class-transformer';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { v4 } from 'uuid';
import { BaseEntity } from './../model/base-entity';
import { CatalogoPagina } from './catalogo-pagina.entity';

@Entity()
export class Catalogo extends BaseEntity {
  @Column('text', {
    nullable: true,
  })
  titulo: string;

  @Column('text', {
    nullable: false,
  })
  descricao: string;

  @Column('text', {
    nullable: true,
  })
  logo: string;

  @Column('text', {
    nullable: true,
  })
  avatar: string;

  @Exclude()
  @Index()
  @Column('text', {
    nullable: false,
  })
  userId: string;

  @Index({
    unique: true,
  })
  @Column('text', {
    nullable: false,
    unique: true,
  })
  identificador?: string = v4();

  @Column('boolean', { default: false })
  ativo: boolean = false;

  @OneToMany(() => CatalogoPagina, (metadata) => metadata.catalogo, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  paginas: CatalogoPagina[];
}
