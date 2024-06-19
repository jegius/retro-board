import { SectionEntity } from './section.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ColumnsEntity } from '../../columns/enitity/columns.entity';

@Entity('board_sections')
export class BoardSectionEntity extends SectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  viewStatus: string;

  @OneToMany(() => ColumnsEntity, column => column.section, { nullable: true })
  columns?: Promise<ColumnsEntity[]>;
}