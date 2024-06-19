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
import { UserEntity } from '../../user/entity/user.entity';
import { IssueEntity } from '../../issue/enitiy/issue.entity';

@Entity('comments')
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column({ default: 0 })
  likes: number;

  @ManyToOne(() => UserEntity, user => user.comments)
  @JoinColumn()
  author: Promise<UserEntity>;

  @CreateDateColumn()
  creationDate: Date;

  @ManyToOne(() => CommentEntity, comment => comment.replies)
  @JoinColumn()
  answerFor: Promise<CommentEntity>;

  @OneToMany(() => CommentEntity, comment => comment.answerFor, { cascade: true })
  replies: Promise<CommentEntity[]>;

  @ManyToOne(() => IssueEntity, issue => issue.comments)
  issue: Promise<IssueEntity>;
}