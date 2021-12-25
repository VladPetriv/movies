import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favourite } from './entities/favourite.entity';
import { Repository } from 'typeorm';
import { FavouriteItem } from './entities/favourite-item.entity';

@Injectable()
export class FavouriteService {
  constructor(
    @InjectRepository(Favourite)
    private readonly favouriteRepository: Repository<Favourite>,
    @InjectRepository(FavouriteItem)
    private readonly favouriteItemRepository: Repository<FavouriteItem>,
  ) {}

  async create(): Promise<Favourite> {
    const favourite = this.favouriteRepository.create();
    await this.favouriteRepository.save(favourite);
    return favourite;
  }

  async getAllFavouriteItems(favourite_id: number): Promise<FavouriteItem[]> {
    const favourite = await this.favouriteRepository.findOne(favourite_id);
    return await this.favouriteItemRepository.find({
      where: { favourite: favourite },
    });
  }

  async createFavouriteItem(favouriteId: number): Promise<FavouriteItem> {
    const favourite = await this.favouriteRepository.findOne({
      where: {
        id: favouriteId,
      },
    });
    const favouriteItem = await this.favouriteItemRepository.create({
      favourite: favourite,
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
