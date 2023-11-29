import { Inject, Module, InjectionToken } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CatalogoController } from './catalogo.controller';
import { Catalogo, CatalogoSchema } from './schema/catalogo.schema';
import {
  CatalogoPagina,
  CatalogoPaginaSchema,
} from './schema/catalogo-pagina.schema';
import {
  CatalogoPaginaMapeamento,
  CatalogoPaginaMapeamentoSchema,
} from './schema/catalogo-pagina-mapemanto.schema';
import { Model } from 'mongoose';
import { CatalogoPaginaMapeamentoService } from './services/catalogo-pagina-mapeamento.service';
import { CatalogoPaginaService } from './services/catalogo-pagina.service';
import { CatalogoService } from './services/catalogo.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeatureAsync([
      {
        name: Catalogo.name,
        useFactory: (
          catalogoPaginaModel: Model<CatalogoPagina>,
          catalogoPaginaMapeamentoModel: Model<CatalogoPaginaMapeamento>,
        ) => {
          const schema = CatalogoSchema;
          schema.pre('save', async function () {
            const session = this.$session();

            const paginas = await new CatalogoPaginaService(
              catalogoPaginaModel,
              new CatalogoPaginaMapeamentoService(
                catalogoPaginaMapeamentoModel,
              ),
            ).salvarRegistros(this.paginas, session);

            this.paginas.push(...paginas);
          });
          return schema;
        },
        inject: [
          getModelToken(CatalogoPagina.name),
          getModelToken(CatalogoPaginaMapeamento.name),
        ],
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
