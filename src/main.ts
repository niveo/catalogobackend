import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { carregarSwaggerModule } from './catalogo/catalogo-swagger.document';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as nocache from 'nocache';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

const checkEnvironment = (configService: ConfigService) => {
  const requiredEnvVars = [
    'MONGODB_URI',
    'PORT',
    'ISSUER_BASE_URL',
    'AUDIENCE',
    'CLIENT_ORIGIN_URL',
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
