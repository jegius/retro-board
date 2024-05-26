import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    JoinColumn,
    ManyToOne,
    ManyToMany,
    JoinTable
} from 'typeorm';
import { RoleEntity } from '../../role/entity/role.entity';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ length: 100 })
    @IsNotEmpty({ message: 'Name is required' })
    username: string;

    @Column({ length: 100 })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @Column({ length: 255 })
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
    registeredAt: Date;

    @ManyToMany(() => RoleEntity)
    @JoinTable({
        name: "user_roles",
        joinColumn: { name: "user_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "role_id", referencedColumnName: "id" }
    })
    roles: RoleEntity[];

    @Column({ nullable: true })
    avatarUrl: string;
}