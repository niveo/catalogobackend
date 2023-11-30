import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Catalogo,
  CatalogoPagina,
  CatalogoPaginaMapeamento,
} from './catalogo/models';

export const typeOrmProviderModule = [
  TypeOrmModule.forRootAsync({
    useFactory: (config: ConfigService) => {
      return {
        type: 'postgres',
        host: config.get('PGHOST'),
        port: 5432,
        username: config.get('PGUSER'),
        password: config.get('PGPASSWORD'),
        database: config.get('PGDATABASE'),
        entities: [Catalogo, CatalogoPagina, CatalogoPaginaMapeamento],
        synchronize: true,
      };
    },
    imports: [
      ConfigModule.forRoot({
        envFilePath: process.env.PRODUCTION ? '.env' : '.development.env',
      }),
    ],
    inject: [ConfigService],
  }),
];
