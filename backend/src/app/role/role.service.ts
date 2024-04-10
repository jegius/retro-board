import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from './entity/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  findAll(): Promise<RoleEntity[]> {
    return this.roleRepository.find();
  }

  findOne(id: number): Promise<RoleEntity> {
    return this.roleRepository.findOneBy({ id });
  }

  findOneByName(name: string): Promise<RoleEntity> {
    return this.roleRepository.findOneBy({ name });
  }
}