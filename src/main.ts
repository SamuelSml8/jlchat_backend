import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('JL Chat API')
    .setDescription(
      'The JL Chat API provides a set of endpoints for managing chat functionalities, including user authentication, chat room management, and message handling. This API is designed to support real-time communication features and integrates with MongoDB for data storage. The endpoints include operations for user registration, chat room creation, and message exchange, making it a comprehensive solution for building chat applications. \n\n◌ Samuel Vera Miranda',
    )
    .setVersion('1.0')
    .addTag('JL Chat')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
