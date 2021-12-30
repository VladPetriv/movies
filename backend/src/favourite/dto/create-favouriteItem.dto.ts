import { ApiProperty } from '@nestjs/swagger';

export class CreateFavouriteItemDto {
  @ApiProperty({ example: '1', description: 'Unique favourite id' })
  readonly favourite_id: number;

  @ApiProperty({ example: '1', description: 'Unique movie id' })
  readonly movie_id: number;
}
