import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './user.service';
import { UserController } from './user.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
    ]),
    PassportModule,
    JwtModule.register({ secret: 'mysecret', signOptions: { expiresIn: '1h' } }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [UserController],
  exports: [AuthService, TypeOrmModule, JwtModule]
})
export class AuthModule {}