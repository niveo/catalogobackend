import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CatalogoController } from './catalogo.controller';
import { CatalogoService } from './catalogo.service';
import { Catalogo, CatalogoSchema } from './schema/catalogo.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Catalogo.name,
        schema: CatalogoSchema,
      },
    ]),
  ],
  controllers: [CatalogoController],
  providers: [CatalogoService],
})
export class CatalogoModule {}
