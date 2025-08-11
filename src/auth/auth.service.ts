import {
  BadRequestException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from './entities/user.entity';
import { AuthToken } from './entities/auth_tokens.entity';
import { PasswordReset } from './entities/password_resets.entity';
import { LoginLog } from './entities/login_logs.entity';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { RequestPasswordResetDto,ResetPasswordDto } from './dtos/request-password-reset.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(AuthToken) private readonly authTokenRepo: Repository<AuthToken>,
    @InjectRepository(PasswordReset) private readonly passwordResetRepo: Repository<PasswordReset>,
    @InjectRepository(LoginLog) private readonly loginLogRepo: Repository<LoginLog>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
      const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
      if (existingUser) {
        throw new ConflictException('Email already registered');
      }
      try {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = { ...dto, password: hashedPassword };
        return await this.userRepo.save(user);
      } catch (error) {
        throw new ConflictException(error);
      }
  }

  async updateProfile(id:any,dto:any) {
      try {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
          throw new ConflictException(`User with ID ${id} not found`);
        }
        Object.assign(user, dto);
        return this.userRepo.save(user);
      } catch (error) {
        throw new ConflictException(error);
      }
  }

  async login(dto: LoginDto, ip: string, userAgent: string) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
       throw new ConflictException('Invalid credentials');
    }
    try {
      const payload = { id: user.id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = crypto.randomBytes(32).toString('hex');
      await this.authTokenRepo.save({user,token: refreshToken,expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)});
      await this.loginLogRepo.save({ user, ipAddress: ip, userAgent });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const tokenRecord = await this.authTokenRepo.findOne({
        where: { token: dto.refreshToken, isRevoked: false },
        relations: ['user'],
      });
      if (!tokenRecord || tokenRecord.expiresAt < new Date()) throw new ConflictException('Invalid token');
      const payload = { id: tokenRecord.user.id, email: tokenRecord.user.email, role: tokenRecord.user.role };
      return { accessToken: this.jwtService.sign(payload) };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async requestPasswordReset(dto: RequestPasswordResetDto) {
    try {
      const user = await this.userRepo.findOne({ where: { email: dto.email } });
      if (!user) throw new ConflictException('User not found');

      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

      await this.passwordResetRepo.save({ user, token, expiresAt });
      return { message: 'Reset token generated', token };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const reset = await this.passwordResetRepo.findOne({ where: { token: dto.token }, relations: ['user'] });
      if (!reset || reset.expiresAt < new Date()){
        throw new BadRequestException('Invalid or expired token');
      }else{
        reset.user.password = await bcrypt.hash(dto.newPassword, 10);
        await this.userRepo.save(reset.user);
        await this.passwordResetRepo.delete({ id: reset.id });
        return { message: 'Password reset successfully' };
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getUserLoginLogs(userId: number) {
    try {
      return this.loginLogRepo.find({ where: { user: { id: userId } }, order: { loggedAt: 'DESC' } });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
