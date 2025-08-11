import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfile {
  @ApiProperty({ example: 'john@example.com', description: 'Registered email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123', description: 'User password' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'kvr.jpg', description: 'User Photo' })
  @IsNotEmpty()
  profileImage: string;
}
