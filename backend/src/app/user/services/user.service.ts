import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
    ) {}

    async hashPassword(password: string): Promise<string> {
        if (!password) {
            throw new Error('Password is required to hash.');
        }
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }

    async findOneByEmail(email: string): Promise<UserEntity | undefined> {
        return await this.usersRepository.findOneBy({ email });
    }

    async findAll(): Promise<UserEntity[]> {
        return await this.usersRepository.find();
    }

    async findOne(id: number): Promise<UserEntity | undefined> {
        return await this.usersRepository.findOneBy({ id });
    }

    async create(userDto: UserEntity): Promise<UserEntity> {
        const existingUserByEmail = await this.findOneByEmail(userDto.email);
        if (existingUserByEmail) {
            throw new HttpException('User with this email already exists.', HttpStatus.BAD_REQUEST);
        }

        if (userDto.id) {
            const existingUserById = await this.findOne(userDto.id);
            if (existingUserById) {
                throw new HttpException('User with this ID already exists.', HttpStatus.BAD_REQUEST);
            }
        }

        userDto.password = await this.hashPassword(userDto.password);
        return this.usersRepository.save(userDto);
    }

    async update(id: number, updateUserDto: Partial<UserEntity>): Promise<UserEntity> {
        if (updateUserDto.password) {
            updateUserDto.password = await this.hashPassword(updateUserDto.password);
        }

        await this.usersRepository.update(id, updateUserDto);
        return this.usersRepository.findOne({ where: { id } });
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}