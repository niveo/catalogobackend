import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmProviderModule } from './typeorm.module';
import { CatalogoModule } from './catalogo/catalogo.module';

@Module({
  imports: [ConfigModule.forRoot(), ...typeOrmProviderModule, CatalogoModule],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
