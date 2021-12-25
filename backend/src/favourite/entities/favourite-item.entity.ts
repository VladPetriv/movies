import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Favourite } from './favourite.entity';

@Entity()
export class FavouriteItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Favourite, (favourite) => favourite.favouriteItems)
  favourite: Favourite;
}
