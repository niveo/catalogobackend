import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import { Produto } from '../entities/produto.entity';
import { ProdutoController } from './controllers/produto.controller';
import { ProdutoService } from './produto.service';

@Module({
  imports: [
    ConfigModule,
    ClsModule.forFeature(),
    TypeOrmModule.forFeature([Produto]),
  ],
  controllers: [ProdutoController],
  providers: [ProdutoService],
  exports: [ProdutoService],
})
export class ProdutoModule {}
