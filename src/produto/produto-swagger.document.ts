import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ProdutoModule } from './produto.module';
import { CDN_SWAGGER } from 'src/common/constants/cosntant';

export const carregarProdutoSwaggerModule = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Produto')
    .setDescription('The Produto API description')
    .setVersion('1.0')
    .addTag('produto')
    .addBearerAuth()
    .build();

  const doc = SwaggerModule.createDocument(app, config, {
    include: [ProdutoModule],
  });

  SwaggerModule.setup('api/produto', app, doc, {
    customSiteTitle: 'produtoapi',
    ...CDN_SWAGGER,
  });
};
