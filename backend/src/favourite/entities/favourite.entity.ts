import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FavouriteItem } from './favourite-item.entity';

@Entity()
export class Favourite {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => FavouriteItem, (favouriteItem) => favouriteItem.favourite, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  favouriteItems: FavouriteItem[];
}
