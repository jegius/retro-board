import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException, HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserEntity } from './entity/user.entity';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

class Role {
  id: number;
  name: string;
}

class UserWithRoleExample {
  id: number;
  email: string;
  username: string;
  registeredAt: Date;
  roles: Role[];
}

class UserCreateUpdateExample {
  email: string;
  username: string;
  password: string;
  roles: number[];
}
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users',
    type: [UserEntity],
    schema: {
      example: [
        {
          id: 1,
          email: 'email@example.com',
          username: 'John Doe',
          roleId: 1, // Это новое поле
          role: { id: 1, name: 'Administrator' } // Пример объекта роли
        },
        {
          id: 2,
          email: 'jane@example.com',
          username: 'Jane Doe',
          roleId: 2,
          role: { id: 2, name: 'User' }
        }
      ],
    },
  })
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  async findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }


  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({
    name: 'id',
    description: 'UserEntity ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Return user',
    type: UserEntity,
    schema: {
      example: {
        email: 'user@example.com',
        username: 'New User',
        password: 'Password123',
        roles: [1],
      },
    },
  })
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  async findOne(@Param('id') id: number): Promise<UserEntity> {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiBody({
    description: 'UserEntity Payload',
    type: UserEntity,
    schema: {
      example: {
        email: 'user@example.com',
        username: 'New User',
        password: 'Password123',
        roles: [1],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'User with this email or ID already exists.',
  })
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  async create(@Body() user: UserEntity): Promise<UserEntity> {
    try {
      return this.userService.create(user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiBody({
    description: 'UserEntity Payload',
    type: UserCreateUpdateExample,
    schema: {
      example: {
        email: 'user@example.com',
        username: 'New User',
        password: 'Password123',
        roles: [1],
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'UserEntity is created',
    type: UserWithRoleExample,
    schema: {
      example: {
        id: 3,
        email: 'user@example.com',
        username: 'New User',
        registeredAt: '2023-01-01T00:00:00.000Z',
        roles: [{ id: 1, name: 'Administrator' }],
      },
    },
  })
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  async update(@Param('id') id: number, @Body() user: Partial<UserEntity>): Promise<UserEntity> {
    return this.userService.update(id, user);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', description: 'UserEntity ID', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'UserEntity is deleted',
    schema: {
      example: { message: 'UserEntity successfully deleted.' },
    },
  })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }
}