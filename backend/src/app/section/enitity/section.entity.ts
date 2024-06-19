import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity, ManyToMany, JoinTable } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { SessionEntity } from '../../session/entity/session.entity';

@Entity('sections')
export class SectionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: "varchar" })
  type: string;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  members: Promise<UserEntity[]>;

  @ManyToOne(() => SessionEntity, session => session.sections)
  session: Promise<SessionEntity>;
}