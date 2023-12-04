import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatalogoModule } from './catalogo/catalogo.module';
import { CommonModule } from './common.module';
@Module({
  imports: [CommonModule, CatalogoModule],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
