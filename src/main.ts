import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { carregarSwaggerModule } from './catalogo/catalogo-swagger.document';
//import * as nocache from 'nocache';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  carregarSwaggerModule(app);

  //app.setGlobalPrefix('api');

  app.useGlobalFilters(new HttpExceptionFilter());

  //app.use(nocache());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableCors({
    origin: configService.get<string>('CLIENT_ORIGIN_URL'),
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    maxAge: 86400,
  });

  app.use(
    helmet({
      hsts: { maxAge: 31536000 },
      frameguard: { action: 'deny' },
      contentSecurityPolicy: {
        directives: {
          'default-src': ["'self'"],
          'frame-ancestors': ["'none'"],
        },
      },
    }),
  );

  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
