import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CommentEntity } from '../../comment/entity/comment.entity';
import { ColumnsEntity } from '../../columns/enitity/columns.entity';

@Entity('issues')
export class IssueEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column('simple-array', { nullable: true })
  stickerUrls: string[];

  @Column({ default: 0 })
  likes: number;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'int' })
  authorId: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creationDate: Date;

  @OneToMany(() => CommentEntity, comment => comment.issue, { eager: true, cascade: true })
  comments: Promise<CommentEntity[]>;

  @ManyToOne(() => ColumnsEntity, column => column.issues)
  column: Promise<ColumnsEntity>;
}