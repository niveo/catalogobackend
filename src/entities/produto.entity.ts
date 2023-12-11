import { Exclude } from 'class-transformer';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './../model/base-entity';

@Entity()
export class Produto extends BaseEntity {
  @Column('text', {
    nullable: false,
  })
  descricao: string;

  @Exclude()
  @Index({
    unique: true,
  })
  @Column('text', {
    nullable: false,
  })
  referencia: string;
}
