import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { RoleEntity } from '../../role/entity/role.entity';

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ length: 100 })
    username: string;

    @Column({ length: 100 })
    email: string;

    @Column({ length: 255 })
    password: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
    registeredAt: Date;

    @ManyToOne(() => RoleEntity, role => role.users)
    @JoinColumn({ name: 'roleId' })
    role: RoleEntity;

    @Column({ nullable: true })
    roleId: number;
}