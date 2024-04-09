import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/User';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async findOneByEmail(email: string): Promise<User | undefined> {
        return await this.usersRepository.findOneBy({ email });
    }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async findOne(id: any): Promise<User | undefined> {
        return await this.usersRepository.findOne(id);
    }

    async create(user: User): Promise<User> {
        return await this.usersRepository.save(user);
    }

    async update(id: any, updateUserDto: Partial<User>): Promise<User> {
        await this.usersRepository.update(id, updateUserDto);
        return await this.usersRepository.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}