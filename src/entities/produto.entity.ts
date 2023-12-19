import { Column, Entity, Index, Unique, VirtualColumn } from 'typeorm';
import { BaseEntity } from './base-entity';
import { Exclude } from 'class-transformer';

@Unique('UNQ_REFERENCIA_USUARIO', ['referencia', 'userId'])
@Entity()
export class Produto extends BaseEntity {
  @Column('text', {
    nullable: false,
  })
  descricao: string;

  @Index({
    unique: true,
  })
  @Column('text', {
    nullable: false,
  })
  referencia: string;

  @Exclude()
  @Index()
  @Column('text', {
    nullable: false,
  })
  userId: string;

  @Column('boolean', { default: false })
  ativo: boolean = false;

  //Campo criado para deixar um registro base para novos usuários
  @Exclude()
  @Column('boolean', { default: false })
  sistema: boolean = false;

  @VirtualColumn({
    query: (alias) =>
      `SELECT count("produtoId") 
      FROM public.catalogo_pagina_mapeamento_produtos_produto
      WHERE "produtoId" = ${alias}.id
      GROUP BY "produtoId"`,
  })
  mapeados?: number = 0;
}
