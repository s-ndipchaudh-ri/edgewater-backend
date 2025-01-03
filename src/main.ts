import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'], // Enable all log levels
  });
  // Enable CORS
  app.enableCors();
  // Use body-parser middleware
  app.use(bodyParser.json({ limit: '10mb' })); // Parse JSON requests up to 10MB
  app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded requests

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('User API with JWT Authentication')
    .setVersion('1.0')
    .addBearerAuth() // Enable Bearer token input
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
