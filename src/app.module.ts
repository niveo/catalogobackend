import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatalogoModule } from './catalogo/catalogo.module';
import { CommonModule } from './common.module';
import { ClsModule, ClsModuleFactoryOptions } from 'nestjs-cls';
import { jwtDecode } from 'jwt-decode';
import { v5 as uuidv5 } from 'uuid';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProdutoModule } from './produto/produto.module';

@Module({
  imports: [
    CommonModule,
    CatalogoModule,
    ProdutoModule,
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
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
