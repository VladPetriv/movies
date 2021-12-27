import { Test, TestingModule } from '@nestjs/testing';
import { FavouriteController } from '../favourite.controller';
import { FavouriteService } from '../favourite.service';
import { AuthGuard } from '../../auth/auth.guard';
import { CreateFavouriteItemDto } from '../dto/create-favouriteItem.dto';
import { MoviesService } from '../../movies/movies.service';

describe('FavouriteController', () => {
  let controller: FavouriteController;
  const mockGuard = {
    canActivate: jest.fn(() => true),
  };
  const mockFavouriteService = {
    getAllFavouriteItems: jest.fn(() => {
      return [];
    }),
    getOneFavouriteItem: jest.fn(
      (favourite_id: number, favouriteItem_id: number) => {
        return {
          id: favouriteItem_id,
          favourite: favourite_id,
          movie: 1,
        };
      },
    ),
    createFavouriteItem: jest.fn((dto: CreateFavouriteItemDto) => {
      return {
        id: 1,
        favourite: dto.favourite_id,
        movie: dto.movie_id,
      };
    }),
  };

  const mockMovieService = {
    getOneMovie: jest.fn((movie_id: number) => {
      return {
        id: movie_id,
        title: 'test',
        description: 'test',
        year: 2020,
        country: 'USA',
        budget: '200000$',
      };
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavouriteController],
      providers: [FavouriteService],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockGuard)
      .overrideProvider(MoviesService)
      .useValue(mockMovieService)
      .overrideProvider(FavouriteService)
      .useValue(mockFavouriteService)
      .compile();

    controller = module.get<FavouriteController>(FavouriteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should return all favourite items', () => {
    expect(controller.getAllFavouriteItems('1')).toEqual([]);
  });
  it('should return favourite item by id', () => {
    expect(controller.getOneFavouriteItem('1', '1')).toEqual({
      id: 1,
      favourite: 1,
      movie: 1,
    });
  });
  it('should create favourite item', () => {
    expect(
      controller.createFavouriteItem({ favourite_id: 1, movie_id: 1 }),
    ).toEqual({
      id: 1,
      favourite: 1,
      movie: 1,
    });
  });
});
