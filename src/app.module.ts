import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { User } from './auth/entities/user.entity';
import { AuthToken } from './auth/entities/auth_tokens.entity';
import { PasswordReset } from './auth/entities/password_resets.entity';
import { LoginLog } from './auth/entities/login_logs.entity';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { AuthModule } from './auth/auth.module';
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
  controllers: [AuthController],
  providers: [AuthService,IsUniqueConstraint],
})
export class AppModule {}