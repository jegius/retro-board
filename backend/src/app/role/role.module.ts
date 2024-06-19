import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { RoleEntity } from './entity/role.entity';
import { RoleController } from './role.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity]), forwardRef(() => AuthModule),],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService, TypeOrmModule],
})
export class RoleModule {}