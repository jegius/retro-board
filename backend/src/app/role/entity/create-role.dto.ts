import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'The name of the role is required.' })
  @IsString({ message: 'The name must be a string.' })
  @MaxLength(50, { message: 'The name is too long. It should not exceed 50 characters.' })
  name: string;
}