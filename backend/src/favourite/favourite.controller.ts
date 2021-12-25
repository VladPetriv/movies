import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FavouriteItem } from './entities/favourite-item.entity';
import { FavouriteService } from './favourite.service';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Favourite controller')
@Controller('favourite')
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}

  @ApiOperation({ summary: 'Get all favourite items' })
  @ApiResponse({ status: 200, type: [FavouriteItem] })
  @UseGuards(AuthGuard)
  @Get('')
  getAllFavouriteItems(
    @Param('favourite_id') favourite_id: string,
  ): Promise<FavouriteItem[]> {
    return this.favouriteService.getAllFavouriteItems(Number(favourite_id));
  }

  @ApiOperation({ summary: 'Get one favourite items' })
  @ApiResponse({ status: 200, type: FavouriteItem })
  @UseGuards(AuthGuard)
  @Get('/:favourite_id/items/:favouriteItem_id')
  getOneFavouriteItem(
    @Param('favourite_id') favourite_id: string,
    @Param('favouriteItem_id') favouriteItem_id: string,
  ): Promise<FavouriteItem> {
    return this.favouriteService.getOneFavouriteItem(
      Number(favourite_id),
      Number(favouriteItem_id),
    );
  }

  @ApiOperation({ summary: 'Create favourite item' })
  @ApiResponse({ status: 200, type: FavouriteItem })
  @UseGuards(AuthGuard)
  @Get('/:favourite_id/create')
  createFavouriteItem(
    @Param('favourite_id') favourite_id: string,
  ): Promise<FavouriteItem> {
    return this.favouriteService.createFavouriteItem(Number(favourite_id));
  }
}
