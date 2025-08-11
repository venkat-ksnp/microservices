import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const url = configService.get<string>('AUTH_SERVICE_URL');
          const queue = configService.get<string>('AUTH_SERVICE_QUE');
          if (!url || !queue) {
            throw new Error(
              'Missing USER_SERVICE_URL or USER_QUEUE in environment variables',
            );
          }
          return {
            transport: Transport.RMQ,
            options: {
              urls: [url],
              queue,
              queueOptions: { durable: true },
            },
          };
        },
      }
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMQModule {}
