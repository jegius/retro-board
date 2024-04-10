import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserEntity } from './entity/user.entity';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

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
        id: 1,
        email: 'email@example.com',
        username: 'John Doe',
        roleId: 1,
        role: { id: 1, name: 'Administrator' }
      },
    },
  })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<UserEntity> {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiBody({
    description: 'UserEntity Payload',
    type: UserEntity,
    schema: {
      example: {
        email: 'newuser@example.com',
        name: 'New UserEntity',
        role: { id: 1, name: 'Administrator' },
        password: 'Password123',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'UserEntity is created',
    type: UserEntity,
    schema: {
      example: {
        id: 3,
        email: 'newuser@example.com',
        name: 'New UserEntity',
        role: { id: 1, name: 'Administrator' }
      },
    },
  })
  @Post()
  async create(@Body() user: UserEntity): Promise<UserEntity> {
    return this.userService.create(user);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'UserEntity ID', type: Number, example: 1 })
  @ApiBody({
    description: 'Updated user payload',
    type: UserEntity,
    schema: {
      example: {
        email: 'user1updated@example.com',
        name: 'John Doe Updated',
        role: { id: 1, name: 'Administrator' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'UserEntity is updated',
    type: UserEntity,
    schema: {
      example: {
        id: 1,
        email: 'user1updated@example.com',
        name: 'John Doe Updated',
        role: { id: 1, name: 'Administrator' },
      },
    },
  })
  @Put(':id')
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
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }
}