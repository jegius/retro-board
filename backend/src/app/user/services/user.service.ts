import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';

import * as bcrypt from 'bcrypt';
import { RoleEntity } from '../../role/entity/role.entity';
import process from 'process';
import { RoleService } from '../../role/role.service';
import { UserDto } from '../entity/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly rolesService: RoleService
  ) {
  }

  async hashPassword(password: string): Promise<string> {
    if (!password) {
      throw new Error('Password is required to hash.');
    }
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  async findOneByEmail(email: string): Promise<UserEntity | undefined> {
    return await this.usersRepository.findOne({
      where: { email },
      relations: ['roles']
    });
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find({
      relations: ['roles']
    });
  }

  async findOne(id: number): Promise<UserEntity | undefined> {
    return await this.usersRepository.findOne({
      where: { id },
      relations: ['roles']
    });
  }

  async create(userDto: UserEntity): Promise<UserEntity> {
    const existingUser = await this.findOneByEmail(userDto.email);
    if (existingUser) {
      throw new HttpException('User with this email already exists.', HttpStatus.BAD_REQUEST);
    }

    userDto.password = await this.hashPassword(userDto.password);

    const newUser: UserEntity = this.usersRepository.create(userDto);

    if (!userDto.roles || userDto.roles.length === 0) {
      const defaultRole = await this.rolesService.findOneByName(process.env.USER_ROLE_NAME);
      if (defaultRole) {
        newUser.roles = [defaultRole];
      }
    } else {
      const roles = await Promise.all(userDto.roles.map(role => this.rolesService.findOne(role.id)));

      newUser.roles = roles.filter(role => role !== undefined) as RoleEntity[];
    }

    return this.usersRepository.save(newUser);
  }

  async update(id: number, updateUserDto: Partial<UserEntity>): Promise<UserEntity> {
    const userToUpdate = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles'] // Убедимся, что мы загружаем роли
    });

    if (!userToUpdate) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    if (updateUserDto.roles) {
      const roles = await Promise.all(updateUserDto.roles.map(role => this.rolesService.findOne(role.id)));
      userToUpdate.roles = roles.filter(role => role !== undefined) as RoleEntity[];
    }

    await this.usersRepository.save(Object.assign(userToUpdate, updateUserDto));

    return this.usersRepository.findOne({
      where: { id },
      relations: ['roles']
    });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async updateAvatar(userId: number, avatarUrl: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    user.avatarUrl = avatarUrl;
    return this.usersRepository.save(user);
  }
}