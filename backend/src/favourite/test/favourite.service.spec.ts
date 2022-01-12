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
import { FilesModule } from '../../files/files.module';
import { FilesService } from '../../files/files.service';
import { Actor } from '../../actors/actor.entity';
import { Genre } from '../../genres/genre.entity';
import { GenresService } from '../../genres/genres.service';
import { Rating } from '../../rating/rating.entity';
import { User } from '../../users/user.entity';
import { Role } from '../../roles/roles.entity';

describe('FavouriteService', () => {
  let service: FavouriteService;
  let favouriteRepository: Repository<Favourite>;
  let favouriteItemRepository: Repository<FavouriteItem>;
  let movieRepository: Repository<Movie>;
  let movieService: MoviesService;
  let genreRepository: Repository<Genre>;
  let genreService: GenresService;

  const connectionName = 'tests';
  const testHelper = new TestHelper(connectionName, [
    Favourite,
    FavouriteItem,
    Movie,
    Actor,
    Genre,
    Rating,
    User,
    Role,
  ]);

  beforeAll(async () => {
    await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.${process.env.NODE_ENV}.env`,
        }),
        FilesModule,
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
        GenresService,
        {
          provide: getRepositoryToken(Genre),
          useClass: Repository,
        },
      ],
    }).compile();
    const connection = await testHelper.createTestConnection();

    genreRepository = getRepository(Genre, connectionName);
    genreService = new GenresService(genreRepository);
    favouriteRepository = getRepository(Favourite, connectionName);
    favouriteItemRepository = getRepository(FavouriteItem, connectionName);
    movieRepository = getRepository(Movie, connectionName);
    movieService = new MoviesService(
      movieRepository,
      new FilesService(),
      genreService,
    );
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
    let genre;
    beforeEach(async () => {
      genre = await genreService.create({
        name: 'test1',
        description: 'test',
      });
      movie = await movieService.createMovie({
        title: 'test',
        description: 'test',
        year: 2020,
        country: 'USA',
        budget: '200000$',
        poster: 'test.jpg',
        genre_name: genre.name,
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
