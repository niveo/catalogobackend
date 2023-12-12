import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CatalogoModule } from './catalogo.module';
import { INestApplication } from '@nestjs/common';
import { CDN_SWAGGER } from 'src/common/constants/cosntant';

export const carregarCatalogoSwaggerModule = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Catalogo')
    .setDescription('The Catalogo API description')
    .setVersion('1.0')
    .addTag('catalogo')
    .addTag('catalogoPagina')
    .addTag('catalogoPaginaMapeamento')
    .addBearerAuth()
    .build();

  const doc = SwaggerModule.createDocument(app, config, {
    include: [CatalogoModule],
  });

  SwaggerModule.setup('api/catalogo', app, doc, {
    customSiteTitle: 'catalogoapi',
    ...CDN_SWAGGER,
  });
};
