import { SectionEntity } from './section.entity';
import { Column } from 'typeorm';

export class RatingSectionEntity extends SectionEntity {
  @Column({ nullable: true })
  ratings?: any;
}