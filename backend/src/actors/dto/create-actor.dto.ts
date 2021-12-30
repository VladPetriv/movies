import { ApiProperty } from '@nestjs/swagger';

export class CreateActorDto {
  @ApiProperty({ example: 'Tom Holland', description: 'Actor name' })
  name: string;

  @ApiProperty({ example: 21, description: 'Actor age' })
  age: number;

  @ApiProperty({
    example: 'Actor was born...',
    description: 'Actor description',
  })
  description: string;

  @ApiProperty({ example: 'image.jpg', description: 'Actor image' })
  image: string;
}
