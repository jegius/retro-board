import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './user/entity/user.entity';
import * as process from 'process';
import { RoleModule } from './role/role.module';
import { RoleEntity } from './role/entity/role.entity';
import { SetupInitialRolesAndUser1678645809200 } from '../migration/1712763971933-SetupInitialRolesAndUser';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './config/miller.config';
import * as path from 'path';
import { BoardEntity } from './board/entity/board.entity';
import { ColumnsEntity } from './columns/enitity/columns.entity';
import { CommentEntity } from './comment/entity/comment.entity';
import { IssueEntity } from './issue/enitiy/issue.entity';
import { BoardSectionEntity } from './section/enitity/board.entity';
import { RatingSectionEntity } from './section/enitity/rating.entity';
import { RatingItemEntity } from './section/enitity/rating-item.entity';
import { SectionEntity } from './section/enitity/section.entity';
import { SessionEntity } from './session/entity/session.entity';
import { StickerEntity } from './sticker/entity/sticker.entity';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [
        UserEntity,
        BoardEntity,
        ColumnsEntity,
        CommentEntity,
        IssueEntity,
        RoleEntity,
        BoardSectionEntity,
        RatingSectionEntity,
        RatingItemEntity,
        SectionEntity,
        SessionEntity,
        StickerEntity
      ],
      synchronize: process.env.SYNCHRONIZE === 'true',
      autoLoadEntities: true,
      migrationsRun: true,
      migrations: [SetupInitialRolesAndUser1678645809200],
    }),
    UserModule,
    RoleModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
