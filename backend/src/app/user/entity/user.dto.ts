import { RoleEntity } from '../../role/entity/role.entity';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Email of the user',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The username of the account',
    example: 'user123',
  })
  username: string;

  @ApiProperty({
    description: 'Date when the user was registered',
    type: 'string',
    format: 'date-time',
    example: '2020-01-01T00:00:00.000Z',
  })
  registeredAt: Date;

  @ApiProperty({
    description: 'Roles associated with the user',
    type: 'array',
    items: { $ref: getSchemaPath(RoleEntity) }, // Assuming RoleEntity is also documented
  })
  roles: RoleEntity[];

  @ApiProperty({
    description: 'URL to the user\'s avatar image',
    required: false,
    example: 'https://example.com/avatar.jpg',
  })
  avatarUrl?: string;
}