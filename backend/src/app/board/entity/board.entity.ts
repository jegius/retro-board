import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { SessionEntity } from '../../session/entity/session.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('boards')
export class BoardEntity extends BaseEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({ example: 'New Board' })
  title: string;

  @CreateDateColumn()
  @ApiProperty({ example: '2023-10-12T07:20:50.52Z' })
  creationDate: Date;

  @OneToMany(() => SessionEntity, session => session.board)
  sessions: Promise<SessionEntity[]>;

  @ManyToOne(() => UserEntity, user => user.boards)
  @JoinColumn({ name: "creatorId" })
  creator: UserEntity;
}