import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardEntity } from '../entity/board.entity';
import { CreateBoardDto } from '../entity/create-board.dto';
import { UpdateBoardDto } from '../entity/update-board.dto';
import { UserEntity } from '../../user/entity/user.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
  ) {}

  async create(createBoardDto: CreateBoardDto, user: UserEntity): Promise<BoardEntity> {

    const board = this.boardRepository.create({
      title: createBoardDto.title,
      creationDate: new Date(),
      creator: user,
    });

    return this.boardRepository.save(board);
  }

  async findAll(): Promise<BoardEntity[]> {
    return this.boardRepository.find({ relations: ['creator'] });
  }

  async findOne(id: number): Promise<BoardEntity> {
    const board = await this.boardRepository.findOne({ where: { id }, relations: ['creator'] });
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    return board;
  }

  async update(id: number, updateBoardDto: UpdateBoardDto): Promise<BoardEntity> {
    const board = await this.findOne(id);

    if (updateBoardDto.title) {
      board.title = updateBoardDto.title;
    }

    return this.boardRepository.save(board);
  }

  async remove(id: number): Promise<void> {
    const board = await this.findOne(id);
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    await this.boardRepository.delete(id);
  }
}