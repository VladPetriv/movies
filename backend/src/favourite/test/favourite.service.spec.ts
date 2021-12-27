import { Test } from '@nestjs/testing';
import { getConnection, getRepository, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FavouriteService } from '../favourite.service';
import { Favourite } from '../entities/favourite.entity';
import { FavouriteItem } from '../entities/favourite-item.entity';
import { TestHelper } from '../../util/test-helper';
import { Movie } from '../../movies/movie.entity';
import { MoviesService } from '../../movies/movies.service';

describe('FavouriteService', () => {
  let service: FavouriteService;
  let favouriteRepository: Repository<Favourite>;
  let favouriteItemRepository: Repository<FavouriteItem>;
  let movieRepository: Repository<Movie>;
  let movieService: MoviesService;

  const connectionName = 'tests';
  const testHelper = new TestHelper(connectionName, [
    Favourite,
    FavouriteItem,
    Movie,
  ]);

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
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useClass: Repository,
        },
      ],
    }).compile();
    const connection = await testHelper.createTestConnection();

    favouriteRepository = getRepository(Favourite, connectionName);
    favouriteItemRepository = getRepository(FavouriteItem, connectionName);
    movieRepository = getRepository(Movie, connectionName);
    movieService = new MoviesService(movieRepository);
    service = new FavouriteService(
      favouriteRepository,
      favouriteItemRepository,
      movieService,
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
    let movie;
    beforeEach(async () => {
      movie = await movieService.createMovie({
        title: 'test',
        description: 'test',
        year: 2020,
        country: 'USA',
        budget: '200000$',
      });
      favourite = await service.create();
      favouriteItemId = await service.createFavouriteItem({
        favourite_id: favourite.id,
        movie_id: movie.id,
      });
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
