import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Movie } from '../movies/movie.entity';

@Entity()
export class Rating {
  @ApiProperty({ example: '1', description: 'Unique rating id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '3', description: 'Rating value between 1 and 5' })
  @Column({ nullable: false })
  value: number;

  @ManyToOne(() => User, (user) => user.ratings)
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.ratings)
  movie: Movie;
}
