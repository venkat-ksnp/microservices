import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { AuthService } from './user/user.service';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { AuthModule } from './user/user.module';
import { IsUniqueConstraint } from './common/validators/is-unique.validator';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    RabbitMQModule,
  ],
  controllers: [UserController],
  providers: [AuthService,IsUniqueConstraint],
})
export class AppModule {}