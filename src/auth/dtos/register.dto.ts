import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUnique } from '../../common/validators/is-unique.validator';
import { User } from '../entities/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address of the user' })
  @IsEmail()
  @IsUnique(User, 'email', { message: 'Email already in use' })
  email: string;

  @ApiProperty({ example: 'Password123', description: 'Password (min 6 characters)' })
  @MinLength(6)
  password: string;
}
