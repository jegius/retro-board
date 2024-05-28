import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrationDto {
  @ApiProperty({
    description: 'User email for registration',
    example: 'newuser@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Username for the account',
    example: 'newusername',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Password for the account, minimum length is 6 characters',
    example: 'securepassword',
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}