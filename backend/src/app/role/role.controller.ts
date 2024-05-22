import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleEntity } from './entity/role.entity';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CreateRoleDto } from './entity/create-role.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {
  }

  @Get()
  @ApiBearerAuth('access-token')
  findAll(): Promise<RoleEntity[]> {
    return this.roleService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  findOne(@Param('id') id: number): Promise<RoleEntity> {
    return this.roleService.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiBody({
    description: 'Role data',
    type: CreateRoleDto,
    examples: {
      a: {
        summary: 'Valid example',
        value: {
          name: 'Editor',
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'The role has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins can create roles.' })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<void> {
    const roleExists = await this.roleService.findOneByName(createRoleDto.name);
    if (roleExists) {
      throw new HttpException('Role already exists', HttpStatus.BAD_REQUEST);
    }

    await this.roleService.create(createRoleDto);
  }
}