import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Catalogo,
  CatalogoPagina,
  CatalogoPaginaMapeamento,
} from './catalogo/entities';
import { envDevelopment, envProduction } from './environments/environment';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envProduction
        ? '.env'
        : envDevelopment
          ? '.env.development'
          : '.env.teste',
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
          //Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
          synchronize: !envProduction,
          ssl: envProduction,
          logging: false,
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  exports: [ConfigModule, TypeOrmModule],
})
export class CommonModule {}
