import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatalogoModule } from './catalogo/catalogo.module';
import { CommonModule } from './common.module';
import { ProdutoModule } from './produto/produto.module';
import { imageKitProvider } from './providers/imagekit.provider';
import { MobileModule } from './mobile/mobile.module';

@Module({
  imports: [CommonModule, CatalogoModule, ProdutoModule, MobileModule],
  providers: [AppService, ...imageKitProvider],
  controllers: [AppController],
})
export class AppModule {}
