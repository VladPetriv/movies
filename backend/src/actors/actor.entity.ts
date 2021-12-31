import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '../movies/movie.entity';

@Entity()
export class Actor {
  @ApiProperty({ example: '1', description: 'Unique actor id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Tom Holland', description: 'Actor name' })
  @Column({
    nullable: false,
    unique: true,
  })
  name: string;

  @ApiProperty({ example: 21, description: 'Actor age' })
  @Column({
    nullable: false,
  })
  age: number;

  @ApiProperty({
    example: 'Actor was born...',
    description: 'Actor description',
  })
  @Column({
    nullable: false,
  })
  description: string;

  @ApiProperty({ example: 'image.jpg', description: 'Actor image' })
  @Column({
    nullable: false,
  })
  image: string;

  @ManyToOne(() => Movie, (movie) => movie.actors)
  movie: Movie;
}
