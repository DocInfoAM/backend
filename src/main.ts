import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from '../config/app.config';
import { SwaggerModule } from '@nestjs/swagger';
import swaggerConfig from '../config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors();
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    allowedHeaders: [
      'content-type',
      'Access-Control-Allow-Credentials',
      'Origin',
      'X-Requested-With',
      'Authorization',
      'Accept',
    ],
    origin: appConfig().origins,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
  app.use(cookieParser());
  app.setGlobalPrefix('api');

  if (process.env.VERCEL_NODE_ENV !== 'production') {
    const document = SwaggerModule.createDocument(app, swaggerConfig());
    SwaggerModule.setup('api-doc', app, document);
  }

  const port = appConfig().port;

  await app.listen(port);
}
bootstrap();
