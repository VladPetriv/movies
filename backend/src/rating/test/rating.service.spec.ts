import { Test } from '@nestjs/testing';
import { getConnection, getRepository, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Rating } from '../rating.entity';
import { RatingService } from '../rating.service';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/user.entity';
import { MoviesService } from '../../movies/movies.service';
import { Movie } from '../../movies/movie.entity';
import { TestHelper } from '../../util/test-helper';
import { Favourite } from '../../favourite/entities/favourite.entity';
import { FavouriteItem } from '../../favourite/entities/favourite-item.entity';
import { Genre } from '../../genres/genre.entity';
import { Role } from '../../roles/roles.entity';
import { Actor } from '../../actors/actor.entity';
import { FavouriteService } from '../../favourite/favourite.service';
import { RolesService } from '../../roles/roles.service';
import { FilesService } from '../../files/files.service';
import { GenresService } from '../../genres/genres.service';
import { FilesModule } from '../../files/files.module';
import { NotFoundError } from '../../errors/NotFoundError';

describe('RatingService', () => {
  let service: RatingService;
  let ratingRepository: Repository<Rating>;
  let userService: UsersService;
  let userRepository: Repository<User>;
  let movieService: MoviesService;
  let movieRepository: Repository<Movie>;
  let favouriteService: FavouriteService;
  let favouriteRepository: Repository<Favourite>;
  let favouriteItemRepository: Repository<FavouriteItem>;
  let roleService: RolesService;
  let roleRepository: Repository<Role>;
  let genreService: GenresService;
  let genreRepository: Repository<Genre>;

  const connectionName = 'rating_test';
  const testHelper = new TestHelper(connectionName, [
    Rating,
    Movie,
    User,
    Favourite,
    FavouriteItem,
    Genre,
    Role,
    Actor,
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
        RatingService,
        {
          provide: getRepositoryToken(Rating),
          useClass: Repository,
        },
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useClass: Repository,
        },
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        GenresService,
        {
          provide: getRepositoryToken(Genre),
          useClass: Repository,
        },
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
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
    ratingRepository = getRepository(Rating, connectionName);
    userRepository = getRepository(User, connectionName);
    movieRepository = getRepository(Movie, connectionName);
    roleRepository = getRepository(Role, connectionName);
    favouriteRepository = getRepository(Favourite, connectionName);
    favouriteItemRepository = getRepository(FavouriteItem, connectionName);
    genreRepository = getRepository(Genre, connectionName);
    genreService = new GenresService(genreRepository);
    roleService = new RolesService(roleRepository);
    movieService = new MoviesService(
      movieRepository,
      new FilesService(),
      genreService,
    );
    favouriteService = new FavouriteService(
      favouriteRepository,
      favouriteItemRepository,
      movieService,
    );
    userService = new UsersService(
      userRepository,
      roleService,
      favouriteService,
    );
    service = new RatingService(ratingRepository, userService, movieService);
    return connection;
  });
  afterAll(async () => {
    await getConnection(connectionName).close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return all ratings', async () => {
    const ratings = await service.getAllRatings();

    expect(ratings).toStrictEqual([]);
  });

  describe('Get all ratings by movie', () => {
    let movie;
    let genre;
    beforeAll(async () => {
      genre = await genreService.create({
        name: 'test_genre1',
        description: 'test_description',
      });
      movie = await movieService.createMovie({
        title: 'test_movie1',
        description: 'test',
        poster: 'image.jpg',
        year: 2020,
        country: 'USA',
        budget: '2000$',
        genre_name: genre.name,
      });
    });

    it('should return all ratings by movie', async () => {
      const rating = await service.getAllRatingsByMovie(movie.id);

      expect(rating).toStrictEqual([]);
    });

    it('should throw error that movie not found', async () => {
      try {
        await service.getAllRatingsByMovie(movie.id + 1);
      } catch (err) {
        expect(err.message).toBe('Movie not found');
        expect(err).toBeInstanceOf(NotFoundError);
      }
    });
  });

  describe('Get all ratings by user', () => {
    let user;
    let genre;

    beforeAll(async () => {
      await roleService.create({ value: 'USER', description: 'test' });
      user = await userService.createUser({
        email: 'test1@test.com',
        password: 'test',
      });
      genre = await genreService.create({
        name: 'test_genre2',
        description: 'test_description',
      });
      await movieService.createMovie({
        title: 'test_movie2',
        description: 'test',
        poster: 'image.jpg',
        year: 2020,
        country: 'USA',
        budget: '2000$',
        genre_name: genre.name,
      });
    });

    it('should return all ratings which user set', async () => {
      const ratings = await service.getAllRatingsByUser(user.email);

      expect(ratings).toStrictEqual([]);
    });

    it('should throw error that user not found', async () => {
      try {
        await service.getAllRatingsByUser('not_found_email');
      } catch (err) {
        expect(err.message).toBe('User not found');
        expect(err).toBeInstanceOf(NotFoundError);
      }
    });
  });
  describe('Get one rating which user set to movie', () => {
    let user;
    let movie;
    let genre;
    let ratingC;
    beforeAll(async () => {
      //     await roleService.create({ value: 'USER', description: 'test' });
      user = await userService.createUser({
        email: 'test3@test.com',
        password: 'test',
      });
      genre = await genreService.create({
        name: 'test_genre3',
        description: 'test_description',
      });
      movie = await movieService.createMovie({
        title: 'test_movie3',
        description: 'test',
        poster: 'image.jpg',
        year: 2020,
        country: 'USA',
        budget: '2000$',
        genre_name: genre.name,
      });
      ratingC = await service.createRating({
        value: 5,
        user_email: user.email,
        movie_id: movie.id,
      });
    });

    it('should return rating which user set to movie', async () => {
      const rating = await service.getUserRatingByMovie(user.email, movie.id);

      expect(rating.id).toBe(ratingC.id);
      expect(rating.value).toBe(ratingC.value);
      expect(rating.user.email).toBe(user.email);
      expect(rating.movie.title).toBe(movie.title);
    });
    it('should throw error that user  not found', async () => {
      try {
        await service.getUserRatingByMovie('not_found_email', movie.id);
      } catch (err) {
        expect(err.message).toBe('User not found');
        expect(err).toBeInstanceOf(NotFoundError);
      }
    });
    it('should throw error that movie or user not found', async () => {
      try {
        await service.getUserRatingByMovie('test3@test.com', movie.id + 1);
      } catch (err) {
        expect(err.message).toBe('Movie not found');
        expect(err).toBeInstanceOf(NotFoundError);
      }
    });
  });
});
