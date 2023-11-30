import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { carregarSwaggerModule } from './catalogo/catalogo-swagger.document';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as nocache from 'nocache';
import { HttpExceptionFilter } from './common';
import { ValidationPipe } from '@nestjs/common';

const checkEnvironment = (configService: ConfigService) => {
  const requiredEnvVars = [
    'PORT',
    'ISSUER_BASE_URL',
    'AUDIENCE',
    'CLIENT_ORIGIN_URL',
    'CLIENTE_ID',
    'CLIENT_SECRET',
    'PGPASSWORD',
    'PGUSER',
    'PGDATABASE',
    'PGHOST',
    'DATABASE_URL',
  ];

  requiredEnvVars.forEach((envVar) => {
    if (!configService.get<string>(envVar)) {
      throw Error(`Undefined environment variable: ${envVar}`);
    }
  });
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  checkEnvironment(configService);

  carregarSwaggerModule(app);

  //app.setGlobalPrefix('api');

  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(nocache());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableCors({
    origin: configService.get<string>('CLIENT_ORIGIN_URL'),
    methods: ['GET'],
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
