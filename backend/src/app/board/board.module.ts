import { BoardController } from './board.controller';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { BoardService } from './services/board.service';
import { BoardEntity } from './entity/board.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BoardEntity]), UserModule],
  providers: [BoardService],
  controllers: [BoardController],
  exports: [BoardService, TypeOrmModule]
})
export class BoardModule {
}