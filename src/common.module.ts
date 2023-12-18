import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catalogo, CatalogoPagina, CatalogoPaginaMapeamento } from './entities';
import { Produto } from './entities/produto.entity';
import { envVercel } from './environments/environment';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
          entities: [
            Produto,
            Catalogo,
            CatalogoPagina,
            CatalogoPaginaMapeamento,
          ],
          //Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
          synchronize: false,
          ssl: envVercel,
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
