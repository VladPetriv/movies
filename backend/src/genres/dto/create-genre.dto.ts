import { ApiProperty } from '@nestjs/swagger';

export class CreateGenreDto {
  @ApiProperty({ example: 'Horror', description: 'Genre name' })
  readonly name: string;

  @ApiProperty({
    example: 'This genre is...',
    description: 'Genre description',
  })
  readonly description: string;
}
