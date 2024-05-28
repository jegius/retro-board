import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RoleEntity {
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
}