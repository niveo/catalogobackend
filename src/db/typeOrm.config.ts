import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Produto } from '../entities/produto.entity';
import {
  Catalogo,
  CatalogoPagina,
  CatalogoPaginaMapeamento,
} from '../entities';
 
config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: [Produto, Catalogo, CatalogoPagina, CatalogoPaginaMapeamento],
  migrations: ['src/db/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
 // ssl: true
});
