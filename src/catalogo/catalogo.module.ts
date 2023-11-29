import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CatalogoController } from './controllers/catalogo.controller';
import { Catalogo, CatalogoSchema } from './schema/catalogo.schema';
import {
  CatalogoPagina,
  CatalogoPaginaSchema,
} from './schema/catalogo-pagina.schema';
import {
  CatalogoPaginaMapeamento,
  CatalogoPaginaMapeamentoSchema,
} from './schema/catalogo-pagina-mapemanto.schema';
import { CatalogoService } from './services/catalogo.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeatureAsync([
      {
        name: Catalogo.name,
        useFactory: () => {
          const schema = CatalogoSchema;

          return schema;
        },
        inject: [],
      },
      {
        name: CatalogoPagina.name,
        useFactory: () => {
          return CatalogoPaginaSchema;
        },
      },
      {
        name: CatalogoPaginaMapeamento.name,
        useFactory: () => {
          return CatalogoPaginaMapeamentoSchema;
        },
      },
    ]),
  ],
  controllers: [CatalogoController],
  providers: [CatalogoService],
})
export class CatalogoModule {}
