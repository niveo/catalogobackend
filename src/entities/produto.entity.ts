import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './../model/base-entity';
import { Exclude } from 'class-transformer';

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
}
