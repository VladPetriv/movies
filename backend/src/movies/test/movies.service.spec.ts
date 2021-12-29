import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getConnection, getRepository, Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { HttpException } from '@nestjs/common';
import { Movie } from '../movie.entity';
import { MoviesService } from '../movies.service';
import { TestHelper } from '../../util/test-helper';
import { FilesModule } from '../../files/files.module';
import { FilesService } from '../../files/files.service';

describe('MoviesService', () => {
  let service: MoviesService;
  let movieRepository: Repository<Movie>;
  const connectionName = 'tests';
  const testHelper = new TestHelper(connectionName, [Movie]);

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
      ],
    }).compile();
    const connection = await testHelper.createTestConnection();

    movieRepository = getRepository(Movie, connectionName);
    service = new MoviesService(movieRepository, new FilesService());
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
    beforeAll(async () => {
      movieId = await service.createMovie({
        title: 'test',
        description: 'test.',
        budget: '2000$',
        year: 2020,
        country: 'USA',
        poster: 'test.jpg',
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
    it('should throw an error that movie is not exist', async () => {
      try {
        await service.getOneMovie(movieId.id + 1);
      } catch (err) {
        expect(err.message).toBe('Movie not found');
        expect(err).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('Create movie tests', () => {
    it('should create movie', async () => {
      const movie = await service.createMovie({
        title: 'test.',
        description: 'test.',
        budget: '2000$',
        year: 2020,
        country: 'USA',
        poster: 'test.jpg',
      });
      expect(movie).toBeDefined();
      expect(movie.title).toBe('test.');
      expect(movie.description).toBe('test.');
      expect(movie.budget).toBe('2000$');
    });
    it('should throw an error that movie is exist', async () => {
      try {
        await service.createMovie({
          title: 'test.',
          description: 'test.',
          budget: '2000$',
          year: 2020,
          country: 'USA',
          poster: 'test.jpg',
        });
      } catch (err) {
        expect(err.message).toBe('Movie is exist');
        expect(err).toBeInstanceOf(HttpException);
      }
    });
  });
  describe('Delete movie test', () => {
    let movieId;
    beforeAll(async () => {
      movieId = await service.createMovie({
        title: 'test..',
        description: 'test.',
        budget: '2000$',
        year: 2020,
        country: 'USA',
        poster: 'test.jpg',
      });
    });
    it('should delete movie', async () => {
      const movie = await service.deleteMovie(movieId.id);
      expect(movie).toBe('Movie was deleted');
    });
    it('should throw an error that movie not found', async () => {
      try {
        await service.deleteMovie(movieId.id + 1);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toBe('Movie not found');
      }
    });
  });
});
