import { Controller, Put, Param, Body, Inject,UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateProfile } from './dtos/update-profile.dto';
import { lastValueFrom } from 'rxjs';
import { ApiTags , ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {}

  // @ApiBearerAuth('access-token')
  // @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  async updateUserProfile(@Param('id') id: string, @Body() dto: UpdateProfile) {
    const payload = { id, data: dto };
    return this.authClient.send('update-user-profile', payload)
  }
}
