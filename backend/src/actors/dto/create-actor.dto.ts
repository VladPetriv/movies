import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Length, MaxLength } from 'class-validator';
export class CreateActorDto {
  @ApiProperty({ example: 'Tom Holland', description: 'Actor name' })
  @Length(2, 15, { message: 'Actors name must be between 2 and 15 chars' })
  name: string;

  @ApiProperty({ example: 21, description: 'Actor age' })
  @IsNumber({}, { message: 'Actor age must be a number' })
  age: number;

  @ApiProperty({
    example: 'Actor was born...',
    description: 'Actor description',
  })
  @MaxLength(200, { message: 'Actor description must be less then 200 chars' })
  description: string;

  @ApiProperty({ example: 'image.jpg', description: 'Actor image' })
  image: string;
}
