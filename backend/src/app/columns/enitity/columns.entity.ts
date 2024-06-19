import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IssueEntity } from '../../issue/enitiy/issue.entity';
import { BoardSectionEntity } from '../../section/enitity/board.entity';

@Entity('columns')
export class ColumnsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  type: string;

  @Column({ type: 'int' })
  order: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ManyToOne(() => BoardSectionEntity, section => section.columns, { onDelete: 'CASCADE' })
  section: Promise<BoardSectionEntity>;

  @OneToMany(() => IssueEntity, issue => issue.column, { eager: true, cascade: true })
  issues: Promise<IssueEntity[]>;
}