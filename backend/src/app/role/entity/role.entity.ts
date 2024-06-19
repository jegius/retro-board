import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

@Entity('roles')
export class RoleEntity extends BaseEntity {
  @ApiProperty({
    description: 'The unique identifier of the role',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'The name of the role',
    example: 'Admin',
  })
  @Column({ length: 50, unique: true })
  name: string;

  @ManyToMany(() => UserEntity, user => user.roles)
  users: Promise<UserEntity[]>;
}