import { useContainer } from 'class-validator';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
    urls: [process.env.USER_SERVICE_URL || 'amqp://guest:guest@localhost:5672'],
    queue: process.env.USER_SERVICE_QUE || 'user_queue',
    queueOptions: { durable: true },
    },
  });
  const config = new DocumentBuilder()
    .setTitle('User Service')
    .setDescription('User microservice API')
    .setVersion('1.0')
    .addBearerAuth(
    { 
      type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header', name: 'Authorization' },'access-token'
    )
    .build();
    
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3002);
}
bootstrap();
