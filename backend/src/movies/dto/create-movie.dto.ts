import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Length, MaxLength } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'Terminator', description: 'Movie title' })
  @MaxLength(15, { message: 'Movie title must have less then 15 chars' })
  title: string;

  @ApiProperty({ example: 'image.jpg', description: 'Movie poster' })
  poster: string;

  @ApiProperty({
    example: 'This movie is about...',
    description: 'Movie description',
  })
  @MaxLength(200, { message: 'Movie description must be less then 200 chars' })
  description: string;

  @ApiProperty({ example: 2020, description: 'Year when movie was created' })
  @IsNumber({}, { message: 'Movie year must be a number' })
  year: number;

  @ApiProperty({
    example: 'USA',
    description: 'Country where movie was created',
  })
  @MaxLength(15, { message: 'Movie country must be less then 15 chars' })
  country: string;

  @ApiProperty({ example: '200000$', description: 'Budget for movie' })
  budget: string;

  @ApiProperty({ example: 'horror', description: 'Genre name' })
  genre_name: string;
}
