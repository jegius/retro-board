import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { RatingSectionEntity } from './rating.entity';

@Entity('rating_items')
export class RatingItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, user => user.ratings)
  @JoinColumn()
  author: Promise<UserEntity>;

  @Column()
  value: number;

  @Column('simple-array')
  stickerUrls: string[];

  @ManyToOne(() => RatingSectionEntity, section => section.ratings)
  section: Promise<RatingSectionEntity>;
}