import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { RoleEntity } from '../role/entity/role.entity';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity]), RoleModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {
}