import { SectionEntity } from './section.entity';
import { Column } from 'typeorm';

export class BoardSectionEntity extends SectionEntity {
  @Column({ nullable: true })
  columns?: any;
}