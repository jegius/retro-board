import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus, Inject,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserEntity } from './entity/user.entity';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../role/decorators/roles.decorator';
import { RolesGuard } from '../role/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDto } from './entity/user.dto';
import { toUserDto, userEntitiesToUserDto } from './mappers/user.mappers';
import { IStorageStrategy } from './strategies/storage.strategy';

@ApiTags('users')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService, @Inject('IStorageStrategy') private readonly storageStrategy: IStorageStrategy) {
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users',
    schema: {
      example: [
        {
          id: 1,
          email: 'email@example.com',
          username: 'John Doe',
          roles: [{ id: 1, name: 'Administrator' }]
        },
        {
          id: 2,
          email: 'jane@example.com',
          username: 'Jane Doe',
          roles: [{ id: 1, name: 'Administrator' }]
        }
      ]
    }
  })
  @Get()
  @ApiBearerAuth('access-token')
  async findAll(): Promise<UserDto[]> {
    return this.userService.findAll()
      .then(userEntitiesToUserDto);
  }


  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({
    name: 'id',
    description: 'UserEntity ID',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Return user',
    schema: {
      example: {
        email: 'user@example.com',
        username: 'New User',
        password: 'Password123',
        roles: [1]
      }
    }
  })
  @Get(':id')
  @ApiBearerAuth('access-token')
  async findOne(@Param('id') id: number): Promise<UserDto> {
    return this.userService.findOne(id).then(toUserDto);
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiBody({
    description: 'UserEntity Payload',
    schema: {
      example: {
        email: 'email@example.com',
        username: 'New User',
        password: 'Password123',
        roles: [{
          id: 1,
          name: 'Administrator'
        }]
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Success'
  })
  @ApiResponse({
    status: 400,
    description: 'User with this email or username already exists.'
  })
  @Post()
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
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

  @ApiOperation({ summary: 'Update user' })
  @ApiBody({
    description: 'Payload for updating a user',
    schema: {
      example: {
        email: 'user@example.com',
        username: 'New User',
        password: 'Password123',
        roles: [{ id: 1, name: 'ADMIN' }]
      }
    }
  })
  @Roles('ADMIN')
  @ApiResponse({
    status: 200,
    description: 'UserEntity is updated',
    schema: {
      example: {
        id: 3,
        email: 'example@example.com',
        username: 'UpdatedUserName',
        registeredAt: '2023-01-01T00:00:00.000Z',
        roles: [{ id: 2, name: 'User' }]
      }
    }
  })
  @Put(':id')
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  async update(@Param('id') id: number, @Body() user: Partial<UserEntity>): Promise<UserDto> {
    return this.userService.update(id, user).then(toUserDto);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', description: 'UserEntity ID', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'UserEntity is deleted',
    schema: {
      example: { message: 'UserEntity successfully deleted.' }
    }
  })
  @Delete(':id')
  @ApiBearerAuth('access-token')
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }

  @Post('upload-avatar/:id')
  @ApiOperation({ summary: 'Upload a user avatar' })
  @ApiParam({ name: 'id', required: true, description: 'User ID', type: Number })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User Avatar',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File content of the avatar'
        }
      }
    }
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'UserEntity is updated',
    schema: {
      example: {
        id: 3,
        email: 'example@example.com',
        username: 'UpdatedUserName',
        registeredAt: '2023-01-01T00:00:00.000Z',
        roles: [{ id: 2, name: 'User' }]
      }
    }
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Param('id') id: number, @UploadedFile() file: Express.Multer.File): Promise<UserDto> {
    const avatarUrl = await this.storageStrategy.saveFile(file);
    return this.userService.updateAvatar(id, avatarUrl).then(toUserDto);
  }
}