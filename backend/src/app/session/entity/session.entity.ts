import { SectionEntity } from '../../section/enitity/section.entity';
import { BoardEntity } from '../../board/entity/board.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('sessions')
export class SessionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BoardEntity, board => board.sessions)
  @JoinColumn()
  board: Promise<BoardEntity>;

  @Column()
  startDate: Date;

  @CreateDateColumn()
  creationDate: Date;

  @Column()
  sessionStatus: string;

  @OneToMany(() => SectionEntity, section => section.session)
  sections: Promise<SectionEntity[]>;

  @Column()
  title: string;
}