import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'New Board' })
  title: string;
}