import { Module } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favourite } from './entities/favourite.entity';
import { FavouriteItem } from './entities/favourite-item.entity';
import { FavouriteController } from './favourite.controller';
import { AuthModule } from '../auth/auth.module';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favourite, FavouriteItem]),
    AuthModule,
    MoviesModule,
  ],
  providers: [FavouriteService],
  controllers: [FavouriteController],
  exports: [FavouriteService],
})
export class FavouriteModule {}
