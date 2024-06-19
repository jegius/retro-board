import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { RoleModule } from '../role/role.module';
import { LocalStorageStrategy } from './strategies/local-storage.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), RoleModule],
  providers: [UserService, {
    provide: 'IStorageStrategy',
    useClass: LocalStorageStrategy,
  }],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule]
})
export class UserModule {
}