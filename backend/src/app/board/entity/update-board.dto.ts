import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Updated Board Title' })
  title?: string;
}