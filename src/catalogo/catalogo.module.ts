import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogoPaginaMapeamentoController } from './controllers/catalogo-pagina-mapemanto.controller';
import { CatalogoPaginaController } from './controllers/catalogo-pagina.controller';
import { CatalogoController } from './controllers/catalogo.controller';
import { Catalogo, CatalogoPagina, CatalogoPaginaMapeamento } from './entities';
import { CatalogoPaginaMapeamentoService } from './services/catalogo-pagina-mapeamento.service';
import { CatalogoPaginaService } from './services/catalogo-pagina.service';
import { CatalogoService } from './services/catalogo.service';

@Module({
  imports: [
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
  ],
})
export class CatalogoModule {}
