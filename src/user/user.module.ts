import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RabbitMQModule } from './../rabbitmq/rabbitmq.module';
@Module({
  imports: [
    RabbitMQModule,
    TypeOrmModule.forFeature([
    ]),
    PassportModule,
    JwtModule.register({ secret: 'mysecret', signOptions: { expiresIn: '1h' } }),
  ],
  providers: [UserService, JwtStrategy],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule, JwtModule]
})
export class UserModule {}