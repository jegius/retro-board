import { SectionEntity } from '../../section/enitity/section.entity';

export class SessionEntity {
  id: number;
  startDate: Date;
  creationDate: Date;
  sessionStatus: string;
  sections: SectionEntity[];
  title: string;
}