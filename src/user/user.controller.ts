import { Controller, Put, Param, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { UpdateProfile } from './dtos/update-profile.dto';
import { lastValueFrom } from 'rxjs';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {}

  @Put('update/:id')
  async updateUserProfile(@Param('id') id: string, @Body() dto: UpdateProfile) {
    const pattern = 'update-user-profile';
    const payload = { id, dto };
    return lastValueFrom(this.authClient.send(pattern, payload));
  }
}
