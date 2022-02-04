import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favourite } from './entities/favourite.entity';
import { Repository } from 'typeorm';
import { FavouriteItem } from './entities/favourite-item.entity';
import { Movie } from '../movies/movie.entity';
import { MoviesService } from '../movies/movies.service';
import { CreateFavouriteItemDto } from './dto/create-favouriteItem.dto';

@Injectable()
export class FavouriteService {
  constructor(
    @InjectRepository(Favourite)
    private readonly favouriteRepository: Repository<Favourite>,
    @InjectRepository(FavouriteItem)
    private readonly favouriteItemRepository: Repository<FavouriteItem>,
    private readonly movieService: MoviesService,
  ) {}

  async create(): Promise<Favourite> {
    const favourite: Favourite = this.favouriteRepository.create();
    await this.favouriteRepository.save(favourite);
    return favourite;
  }

  async getAllFavouriteItems(favourite_id: number): Promise<FavouriteItem[]> {
    const favourite: Favourite = await this.favouriteRepository.findOne(
      favourite_id,
    );
    return await this.favouriteItemRepository.find({
      where: { favourite: favourite },
    });
  }

  async createFavouriteItem(
    dto: CreateFavouriteItemDto,
  ): Promise<FavouriteItem> {
    const favourite: Favourite = await this.favouriteRepository.findOne({
      where: {
        id: dto.favourite_id,
      },
    });
    const movie: Movie = await this.movieService.getOneMovie(dto.movie_id);
    const favouriteItem: FavouriteItem =
      await this.favouriteItemRepository.create({
        favourite: favourite,
        movie: movie,
      });
    await this.favouriteItemRepository.save(favouriteItem);
    return favouriteItem;
  }

  async getOneFavouriteItem(
    favourite_id: number,
    favouriteItem_id: number,
  ): Promise<FavouriteItem> {
    return await this.favouriteItemRepository.findOne({
      where: {
        id: favouriteItem_id,
        favourite: favourite_id,
      },
    });
  }
}
