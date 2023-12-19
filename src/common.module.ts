import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtDecode } from 'jwt-decode';
import { ClsModule, ClsModuleFactoryOptions } from 'nestjs-cls';
import { v5 as uuidv5 } from 'uuid';
import { Catalogo, CatalogoPagina, CatalogoPaginaMapeamento } from './entities';
import { Produto } from './entities/produto.entity';
import { envTest, envVercel } from './environments/environment';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClsModule.forRootAsync({
      useFactory(configService: ConfigService) {
        const ca: ClsModuleFactoryOptions = {
          middleware: {
            // automatically mount the
            // ClsMiddleware for all routes
            mount: true,
            setup: (cls, req) => {
              if (req.headers['authorization']) {
                cls.set(
                  'userId',
                  uuidv5(
                    jwtDecode(req.headers['authorization']).sub,
                    configService.get('AUDIENCE'),
                  ),
                );
              }
            },
          },
        };
        return ca;
      },
      imports: [ConfigModule],
      inject: [ConfigService],
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
          entities: [
            Produto,
            Catalogo,
            CatalogoPagina,
            CatalogoPaginaMapeamento,
          ],
          //Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
          synchronize: envTest,
          ssl: envVercel,
          logging: false,
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  exports: [ConfigModule, TypeOrmModule, ClsModule],
})
export class CommonModule {}
