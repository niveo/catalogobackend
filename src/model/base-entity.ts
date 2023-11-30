import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'int',
  })
  id: number;

  @CreateDateColumn()
  cadastrado: Date;

  @UpdateDateColumn()
  atualizado: Date;

  @DeleteDateColumn()
  removido: Date;

  @VersionColumn()
  versao: number;
}
