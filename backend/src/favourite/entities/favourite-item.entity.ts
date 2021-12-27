import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Favourite } from './favourite.entity';
import { Movie } from '../../movies/movie.entity';

@Entity()
export class FavouriteItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Favourite, (favourite) => favourite.favouriteItems)
  favourite: Favourite;

  @OneToOne(() => Movie, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  movie: Movie;
}
