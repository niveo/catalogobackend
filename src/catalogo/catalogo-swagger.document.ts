import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CatalogoModule } from './catalogo.module';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const carregarSwaggerModule = (app: INestApplication) => {
  const configService = app.get<ConfigService>(ConfigService);

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

  SwaggerModule.setup('api', app, doc, {
    customSiteTitle: 'catalogoapi',
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui-standalone-preset.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui-es-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui-es-bundle-core.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui-bundle.min.js',
    ],
  });
};
