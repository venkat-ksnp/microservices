import { IsString,IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'b2f7c29a1f8a4f3cb26f1d3e7e13a3a2d7d6d9c7a8a1b2c3d4e5f6g7h8i9j0k1',
    description: 'The refresh token provided during login',
  })
  @IsNotEmpty({ message: 'Refresh token is required' })
  @IsString()
  refreshToken: string;
}