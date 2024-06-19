import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CreateBoardDto } from './entity/create-board.dto';
import { UpdateBoardDto } from './entity/update-board.dto';
import { BoardService } from './services/board.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BoardEntity } from './entity/board.entity';
import { Request } from 'express';
import { UserEntity } from '../user/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('boards')
@UseGuards(AuthGuard('jwt'))
@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new board' })
  @ApiResponse({ status: 201, description: 'The board has been successfully created.', type: BoardEntity })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateBoardDto, examples: {
      example1: {
        summary: 'Example CreateBoardDto',
        value: {
          title: 'New Board',
        },
      },
    }})
  @ApiBearerAuth('access-token')
  create(@Body() createBoardDto: CreateBoardDto, @Req() req: Request) {
    const user = req.user as UserEntity;
    return this.boardService.create(createBoardDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all boards' })
  @ApiResponse({ status: 200, description: 'List of boards.', type: [BoardEntity] })
  @ApiBearerAuth('access-token')
  findAll() {
    return this.boardService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a board by id' })
  @ApiParam({ name: 'id', description: 'ID of the board', example: 1 })
  @ApiResponse({ status: 200, description: 'The board with the given id.', type: BoardEntity })
  @ApiResponse({ status: 404, description: 'Board not found.' })
  @ApiBearerAuth('access-token')
  findOne(@Param('id') id: string) {
    return this.boardService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a board by id' })
  @ApiParam({ name: 'id', description: 'ID of the board', example: 1 })
  @ApiResponse({ status: 200, description: 'The updated board.', type: BoardEntity })
  @ApiResponse({ status: 404, description: 'Board not found.' })
  @ApiBody({ type: UpdateBoardDto, examples: {
      example1: {
        summary: 'Example UpdateBoardDto',
        value: {
          title: 'Updated Board Title',
        },
      },
    }})
  @ApiBearerAuth('access-token')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(+id, updateBoardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a board by id' })
  @ApiParam({ name: 'id', description: 'ID of the board', example: 1 })
  @ApiResponse({ status: 200, description: 'The board has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Board not found.' })
  @ApiBearerAuth('access-token')
  remove(@Param('id') id: string) {
    return this.boardService.remove(+id);
  }
}