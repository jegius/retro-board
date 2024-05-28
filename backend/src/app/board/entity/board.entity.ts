import { Entity } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { SessionEntity } from '../../session/entity/session.entity';

@Entity()
export class BoardEntity {
  creationDate: Date;
  id: number;
  title: string;
  sessions: SessionEntity[];
  creator: UserEntity;
}