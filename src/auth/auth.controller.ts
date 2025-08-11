import { Body, Controller, Get, Ip, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags , ApiBearerAuth } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { RequestPasswordResetDto,ResetPasswordDto } from './dtos/request-password-reset.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @MessagePattern({ cmd: 'register' })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Ip() ip: string, @Req() req) {
    return this.authService.login(dto, ip, req.headers['user-agent']);
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  @Post('request-password-reset')
  async requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(dto);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('login-logs')
  async getLoginLogs(@Req() req) {
    console.log(req.user)
    return this.authService.getUserLoginLogs(req.user.id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  @Get('admin-only')
  getAdminData() {
    return { secret: 'This is for admins only' };
  }

  @MessagePattern({ cmd: 'update-user-profile' })
  async updateUserProfile(@Body() { id, data }: { id:any; data:any }) {
    console.log('📤 RabbitMQ: Updating profile for', id, data);
    return this.authService.updateProfile(id, data);
  }
}
