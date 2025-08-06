import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { AuthToken } from './entities/auth_tokens.entity';
import { PasswordReset } from './entities/password_resets.entity';
import { LoginLog } from './entities/login_logs.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      AuthToken,
      PasswordReset,
      LoginLog
    ]),
    PassportModule,
    JwtModule.register({ secret: 'mysecret', signOptions: { expiresIn: '1h' } }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, TypeOrmModule, JwtModule]
})
export class AuthModule {}