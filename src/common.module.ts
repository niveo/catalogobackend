import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { production } from './environments/environment';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Catalogo,
  CatalogoPagina,
  CatalogoPaginaMapeamento,
} from './catalogo/entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: production ? '.env' : '.development.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get('PGHOST'),
          port: 5432,
          username: config.get('PGUSER'),
          url: config.get('DATABASE_URL'),
          password: config.get('PGPASSWORD'),
          database: config.get('PGDATABASE'),
          entities: [Catalogo, CatalogoPagina, CatalogoPaginaMapeamento],
          synchronize: true,
          ssl: production,
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  exports: [ConfigModule, TypeOrmModule],
})
export class CommonModule {}
