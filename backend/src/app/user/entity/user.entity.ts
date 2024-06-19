import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToMany,
    JoinTable, OneToMany, BaseEntity, ManyToOne
} from 'typeorm';
import { RoleEntity } from '../../role/entity/role.entity';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { BoardEntity } from '../../board/entity/board.entity';
import { CommentEntity } from '../../comment/entity/comment.entity';
import { RatingItemEntity } from '../../section/enitity/rating-item.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
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

    @ManyToMany(() => RoleEntity, role => role.users)
    @JoinTable({
        name: "user_roles",
        joinColumn: { name: "user_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "role_id", referencedColumnName: "id" }
    })
    roles: Promise<RoleEntity[]>;

    @Column({ nullable: true })
    avatarUrl: string;

    @OneToMany(() => CommentEntity, comment => comment.author)
    comments: Promise<CommentEntity[]>;

    @OneToMany(() => RatingItemEntity, ratingItem => ratingItem.author)
    ratings: Promise<RatingItemEntity[]>;

    @OneToMany(() => BoardEntity, board => board.creator)
    boards: Promise<BoardEntity[]>;
}