import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty({ example: '1', description: 'Rating value between 1 and 5' })
  @IsNumber({}, { message: 'Value must be a number' })
  value: number;

  @ApiProperty({ example: 'test@test.com', description: 'User email' })
  @IsEmail({}, { message: 'Invalid email' })
  user_email: string;

  @ApiProperty({ example: '1', description: 'Unique movie id' })
  @IsNumber({}, { message: 'Value must be a number' })
  movie_id: number;
}
