import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import {
  Catalogo,
  CatalogoPagina,
  CatalogoPaginaMapeamento,
} from '../entities';
import { imageKitProvider } from '../providers/imagekit.provider';
import { CatalogoPaginaMapeamentoController } from './controllers/catalogo-pagina-mapemanto.controller';
import { CatalogoPaginaController } from './controllers/catalogo-pagina.controller';
import { CatalogoController } from './controllers/catalogo.controller';
import { CatalogoPaginaMapeamentoService } from './services/catalogo-pagina-mapeamento.service';
import { CatalogoPaginaService } from './services/catalogo-pagina.service';
import { CatalogoService } from './services/catalogo.service';

@Module({
  imports: [
    ConfigModule,
    ClsModule.forFeature(),
    TypeOrmModule.forFeature([
      Catalogo,
      CatalogoPagina,
      CatalogoPaginaMapeamento,
    ]),
  ],
  controllers: [
    CatalogoController,
    CatalogoPaginaController,
    CatalogoPaginaMapeamentoController,
  ],
  providers: [
    CatalogoService,
    CatalogoPaginaService,
    CatalogoPaginaMapeamentoService,
    ...imageKitProvider,
  ],
})
export class CatalogoModule {}
