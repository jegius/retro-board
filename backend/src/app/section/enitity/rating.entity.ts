import { SectionEntity } from './section.entity';
import { Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RatingItemEntity } from './rating-item.entity';

@Entity('rating_sections')
export class RatingSectionEntity extends SectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => RatingItemEntity, ratingItem => ratingItem.section, { nullable: true })
  @JoinColumn()
  ratings?: Promise<RatingItemEntity[]>;
}