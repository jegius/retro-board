import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleEntity } from './entity/role.entity';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CreateRoleDto } from './entity/create-role.dto';

@ApiTags('Roles')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {
  }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Retrieve all roles' })
  @ApiResponse({ status: 200, description: 'Return all roles.', type: RoleEntity, isArray: true })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(): Promise<RoleEntity[]> {
    return this.roleService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Retrieve a role by id' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'Numeric ID of the role to retrieve',
  })
  @ApiResponse({ status: 200, description: 'Return a single role.', type: RoleEntity })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
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
  })
  @ApiResponse({ status: 201, description: 'The role has been successfully created.', type: CreateRoleDto })
  @ApiResponse({ status: 400, description: 'Bad Request. Role already exists or invalid data provided.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token is missing or invalid.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins can create roles.' })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<void> {
    const roleExists = await this.roleService.findOneByName(createRoleDto.name);
    if (roleExists) {
      throw new HttpException('Role already exists', HttpStatus.BAD_REQUEST);
    }

    await this.roleService.create(createRoleDto);
  }
}