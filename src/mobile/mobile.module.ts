import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { CatalogoModule } from 'src/catalogo/catalogo.module';
import { ProdutoModule } from 'src/produto/produto.module';
import { MobileController } from './mobile.controller';
import { MobileService } from './mobile.service';

@Module({
  imports: [
    ConfigModule,
    ClsModule.forFeature(),
    ProdutoModule,
    CatalogoModule,
  ],
  controllers: [MobileController],
  providers: [MobileService],
})
export class MobileModule {}
