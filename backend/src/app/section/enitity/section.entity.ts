import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: "varchar" })
  type: string;
}