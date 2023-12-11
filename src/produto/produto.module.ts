import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import { Produto } from 'src/entities/produto.entity';
import { ProdutoService } from './produto.service';

@Module({
  imports: [
    ConfigModule,
    ClsModule.forFeature(),
    TypeOrmModule.forFeature([Produto]),
  ],
  controllers: [],
  providers: [ProdutoService],
})
export class ProdutoModule {}
