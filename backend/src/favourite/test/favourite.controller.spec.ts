import { Test, TestingModule } from '@nestjs/testing';
import { FavouriteController } from '../favourite.controller';
import { FavouriteService } from '../favourite.service';
import { AuthGuard } from '../../auth/auth.guard';

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
        };
      },
    ),
    createFavouriteItem: jest.fn((favourite_id: number) => {
      return {
        id: 1,
        favourite: favourite_id,
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
    });
  });
  it('should create favourite item', () => {
    expect(controller.createFavouriteItem('1')).toEqual({
      id: 1,
      favourite: 1,
    });
  });
});
