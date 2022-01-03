import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({ example: 'Terminator', description: 'Movie title' })
  title: string;

  @ApiProperty({ example: 'image.jpg', description: 'Movie poster' })
  poster: string;

  @ApiProperty({
    example: 'This movie is about...',
    description: 'Movie description',
  })
  description: string;

  @ApiProperty({ example: 2020, description: 'Year when movie was created' })
  year: number;

  @ApiProperty({
    example: 'USA',
    description: 'Country where movie was created',
  })
  country: string;

  @ApiProperty({ example: '200000$', description: 'Budget for movie' })
  budget: string;

  @ApiProperty({ example: 'horror', description: 'Genre name' })
  genre_name: string;
}
