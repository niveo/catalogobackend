import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { carregarCatalogoSwaggerModule } from './catalogo/catalogo-swagger.document';
//import * as nocache from 'nocache';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common';
import { carregarProdutoSwaggerModule } from './produto/produto-swagger.document';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  carregarCatalogoSwaggerModule(app);
  carregarProdutoSwaggerModule(app);

  //app.setGlobalPrefix('api');

  app.useGlobalFilters(new HttpExceptionFilter());

  //app.use(nocache());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableCors({
    origin: 'http://localhost:4200',
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

  await app.listen(7000);
}
bootstrap();
