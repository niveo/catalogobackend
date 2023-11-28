import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CatalogoModule } from './catalogo.module';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const config = new DocumentBuilder()
  .setTitle('Catalogo')
  .setDescription('The Catalogo API description')
  .setVersion('1.0')
  .addTag('catalogo')
  .addOAuth2()
  .build();

export const carregarSwaggerModule = (app: INestApplication) => {
  const configService = app.get<ConfigService>(ConfigService);

  const doc = SwaggerModule.createDocument(app, config, {
    include: [CatalogoModule],
  });

  SwaggerModule.setup('api/catalogo', app, doc, {
    customSiteTitle: 'catalogoapi',
    swaggerOptions: {
      persistAuthorization: true,
      oauth2RedirectUrl: 'http://localhost:4000/api/oauth2-redirect.html',
      initOAuth: {
        clientId: configService.get('CLIENTE_ID'),
        clientSecret: configService.get('CLIENT_SECRET'),
        scopes: ['openid, profile'],
        appName: 'catalogoapi',
        useBasicAuthenticationWithAccessCodeGrant: true,
        usePkceWithAuthorizationCodeGrant: true,
      },
    },
  });
};
