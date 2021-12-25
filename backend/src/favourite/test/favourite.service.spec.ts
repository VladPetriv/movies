import { Test } from '@nestjs/testing';
import { getConnection, getRepository, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FavouriteService } from '../favourite.service';
import { Favourite } from '../entities/favourite.entity';
import { FavouriteItem } from '../entities/favourite-item.entity';
import { TestHelper } from '../../util/test-helper';

describe('FavouriteService', () => {
  let service: FavouriteService;
  let favouriteRepository: Repository<Favourite>;
  let favouriteItemRepository: Repository<FavouriteItem>;

  const connectionName = 'tests';
  const testHelper = new TestHelper(connectionName, [Favourite, FavouriteItem]);

  beforeAll(async () => {
    await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.${process.env.NODE_ENV}.env`,
        }),
      ],
      providers: [
        FavouriteService,
        {
          provide: getRepositoryToken(Favourite),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(FavouriteItem),
          useClass: Repository,
        },
      ],
    }).compile();
    const connection = await testHelper.createTestConnection();

    favouriteRepository = getRepository(Favourite, connectionName);
    favouriteItemRepository = getRepository(FavouriteItem, connectionName);
    service = new FavouriteService(
      favouriteRepository,
      favouriteItemRepository,
    );
    return connection;
  });
  afterAll(async () => {
    await getConnection(connectionName).close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('Create favourite test', () => {
    it('should create favourite', async () => {
      const favourite = await service.create();

      expect(favourite).toBeDefined();
      expect(favourite.id).toBe(1);
    });
  });
  describe('Get all favourite items test', () => {
    let favourite;
    beforeEach(async () => {
      favourite = await service.create();
    });
    it('should return all favourite items', async () => {
      const favouriteItems = await service.getAllFavouriteItems(favourite.id);

      expect(favouriteItems).toBeDefined();
      expect(favouriteItems).toStrictEqual([]);
    });
  });
  describe('Get one favourite items test', () => {
    let favourite;
    let favouriteItemId;
    beforeEach(async () => {
      favourite = await service.create();
      favouriteItemId = await service.createFavouriteItem(favourite.id);
    });
    it('should return one favourite items', async () => {
      const favouriteItem = await service.getOneFavouriteItem(
        favourite.id,
        favouriteItemId.id,
      );

      expect(favouriteItem).toBeDefined();
      expect(favouriteItem.id).toBe(favouriteItemId.id);
    });
  });
});
