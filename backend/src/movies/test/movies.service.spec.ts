import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getConnection, getRepository, Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { Movie } from '../movie.entity';
import { MoviesService } from '../movies.service';
import { TestHelper } from '../../util/test-helper';
import { FilesModule } from '../../files/files.module';
import { FilesService } from '../../files/files.service';
import { Actor } from '../../actors/actor.entity';
import { Genre } from '../../genres/genre.entity';
import { GenresService } from '../../genres/genres.service';
import { Rating } from '../../rating/rating.entity';
import { User } from '../../users/user.entity';
import { Role } from '../../roles/roles.entity';
import { Favourite } from '../../favourite/entities/favourite.entity';
import { FavouriteItem } from '../../favourite/entities/favourite-item.entity';
import { RecordIsExistError } from '../../errors/RecordIsExistError';
import { NotFoundError } from '../../errors/NotFoundError';

describe('MoviesService', () => {
  let service: MoviesService;
  let movieRepository: Repository<Movie>;
  let genreRepository: Repository<Genre>;
  let genreService: GenresService;

  const connectionName = 'tests';
  const testHelper = new TestHelper(connectionName, [
    Movie,
    Actor,
    Genre,
    Rating,
    User,
    Role,
    Favourite,
    FavouriteItem,
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
    movieRepository = getRepository(Movie, connectionName);
    genreService = new GenresService(genreRepository);
    service = new MoviesService(
      movieRepository,
      new FilesService(),
      genreService,
    );
    return connection;
  });

  afterAll(async () => {
    await getConnection(connectionName).close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all movie', async () => {
    const movies = await service.getAllMovies();

    expect(movies).toBeDefined();
    expect(movies).toStrictEqual([]);
  });

  describe('Get one movie tests', () => {
    let movieId: Movie;
    let genre: Genre;
    beforeAll(async () => {
      genre = await genreService.create({
        name: 'test1',
        description: 'test',
      });

      movieId = await service.createMovie({
        title: 'test',
        description: 'test.',
        budget: '2000$',
        year: 2020,
        country: 'USA',
        poster: 'test.jpg',
        genre_name: genre.name,
      });
    });

    it('should return movie by id', async () => {
      const movie = await service.getOneMovie(movieId.id);
      expect(movie).toBeDefined();
      expect(movie.id).toBe(movieId.id);
      expect(movie.title).toBe('test');
      expect(movie.description).toBe('test.');
      expect(movie.country).toBe('USA');
      expect(movie.year).toBe(2020);
      expect(movie.budget).toBe('2000$');
    });

    it('should throw error that movie not found', async () => {
      try {
        await service.getOneMovie(movieId.id + 1);
      } catch (err) {
        expect(err.message).toBe('Movie not found');
        expect(err).toBeInstanceOf(NotFoundError);
      }
    });
  });

  describe('Create movie tests', () => {
    let genre: Genre;
    beforeAll(async () => {
      genre = await genreService.create({
        name: 'test2',
        description: 'test',
      });
    });

    it('should create movie', async () => {
      const movie = await service.createMovie({
        title: 'test.',
        description: 'test.',
        budget: '2000$',
        year: 2020,
        country: 'USA',
        poster: 'test.jpg',
        genre_name: genre.name,
      });
      expect(movie).toBeDefined();
      expect(movie.title).toBe('test.');
      expect(movie.description).toBe('test.');
      expect(movie.budget).toBe('2000$');
    });

    it('should throw error that movie is exist', async () => {
      try {
        await service.createMovie({
          title: 'test.',
          description: 'test.',
          budget: '2000$',
          year: 2020,
          country: 'USA',
          poster: 'test.jpg',
          genre_name: genre.name,
        });
      } catch (err) {
        expect(err.message).toBe('Movie is exist');
        expect(err).toBeInstanceOf(RecordIsExistError);
      }
    });
  });

  describe('Delete movie test', () => {
    let movieId;
    let genre;
    beforeAll(async () => {
      genre = await genreService.create({
        name: 'test3',
        description: 'test',
      });
      movieId = await service.createMovie({
        title: 'test..',
        description: 'test.',
        budget: '2000$',
        year: 2020,
        country: 'USA',
        poster: 'test.jpg',
        genre_name: genre.name,
      });
    });
    it('should delete movie', async () => {
      const movie = await service.deleteMovie(movieId.id);
      expect(movie).toBe('Movie was deleted');
    });
    it('should throw error that movie not found', async () => {
      try {
        await service.deleteMovie(movieId.id + 1);
      } catch (err) {
        expect(err.message).toBe('Movie not found');
        expect(err).toBeInstanceOf(NotFoundError);
      }
    });
  });
});
