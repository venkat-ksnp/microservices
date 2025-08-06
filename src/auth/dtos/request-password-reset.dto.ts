import { IsEmail,IsString, MinLength,IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestPasswordResetDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the account requesting a password reset',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    example: 'b2f7c29a1f8a4f3cb26f1d3e7e13a3a2d7d6d9c7a8a1b2c3d4e5f6g7h8i9j0k1',
    description: 'The password reset token received by email',
  })
  @IsNotEmpty({ message: 'Reset token is required' })
  @IsString()
  token: string;

  @ApiProperty({
    example: 'NewStrongPassword@123',
    description: 'The new password for the user account',
  })
  @IsNotEmpty({ message: 'New password is required' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}