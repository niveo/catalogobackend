import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CatalogoModule } from './catalogo/catalogo.module';
import { typeOrmProviderModule } from './typeorm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.PRODUCTION ? '.env' : '.development.env',
    }),
    ...typeOrmProviderModule,
    CatalogoModule,
  ],
})
export class AppModule {}
