import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { SessionEntity } from '../../session/entity/session.entity';

@Entity('boards')
export class BoardEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @CreateDateColumn()
  creationDate: Date;

  @OneToMany(() => SessionEntity, session => session.board)
  sessions: Promise<SessionEntity[]>;

  @ManyToOne(() => UserEntity, user => user.boards)
  creator: Promise<UserEntity>;
}