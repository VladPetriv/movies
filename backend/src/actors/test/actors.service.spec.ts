import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getConnection, getRepository, Repository } from 'typeorm';
import { NotFoundError } from '../../errors/NotFoundError';
import { RecordIsExistError } from '../../errors/RecordIsExistError';
import { FavouriteItem } from '../../favourite/entities/favourite-item.entity';
import { Favourite } from '../../favourite/entities/favourite.entity';
import { FilesModule } from '../../files/files.module';
import { FilesService } from '../../files/files.service';
import { Genre } from '../../genres/genre.entity';
import { GenresService } from '../../genres/genres.service';
import { Movie } from '../../movies/movie.entity';
import { MoviesService } from '../../movies/movies.service';
import { Rating } from '../../rating/rating.entity';
import { Role } from '../../roles/roles.entity';
import { User } from '../../users/user.entity';
import { TestHelper } from '../../util/test-helper';
import { Actor } from '../actor.entity';
import { ActorsService } from '../actors.service';

describe('ActorsService', () => {
  let service: ActorsService;
  let actorRepository: Repository<Actor>;
  let movieService: MoviesService;
  let movieRepository: Repository<Movie>;
  let genreService: GenresService;
  let genreRepository: Repository<Genre>;

  const connectionName = 'tests';
  const testHelper = new TestHelper(connectionName, [
    Actor,
    Movie,
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
        ActorsService,
        {
          provide: getRepositoryToken(Actor),
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
    movieRepository = getRepository(Movie, connectionName);
    movieService = new MoviesService(
      movieRepository,
      new FilesService(),
      genreService,
    );
    actorRepository = getRepository(Actor, connectionName);
    service = new ActorsService(
      actorRepository,
      new FilesService(),
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
  it('should return all actors', async () => {
    const actors = await service.getAll();
    expect(actors).toBeDefined();
    expect(actors).toStrictEqual([]);
  });
  describe('Get one actor tests', () => {
    let actorId;
    let movie;
    let genre;
    beforeAll(async () => {
      genre = await genreService.create({
        name: 'test',
        description: 'test',
      });
      movie = await movieService.createMovie({
        title: 'test',
        description: 'test.',
        budget: '2000$',
        year: 2020,
        country: 'USA',
        poster: 'test.jpg',
        genre_name: genre.name,
      });
      actorId = await service.create(
        {
          name: 'test',
          age: 20,
          description: 'tests.',
          image: 'test.jpg',
        },
        movie.id,
      );
    });
    it('should return actor by id', async () => {
      const actor = await service.getOneById(actorId.id);
      expect(actor).toBeDefined();
      expect(actor.id).toBe(actorId.id);
      expect(actor.name).toBe('test');
      expect(actor.age).toBe(20);
      expect(actor.description).toBe('tests.');
    });
    it('should throw error that actor not found', async () => {
      try {
        await service.getOneById(actorId.id + 1);
      } catch (err) {
        expect(err.message).toBe('Actor not found');
        expect(err).toBeInstanceOf(NotFoundError);
      }
    });
  });
  describe('Create actor tests', () => {
    let movie;
    let genre;
    beforeAll(async () => {
      genre = await genreService.create({
        name: 'test2',
        description: 'test',
      });
      movie = await movieService.createMovie({
        title: 'test_',
        description: 'test.',
        budget: '2000$',
        year: 2020,
        country: 'USA',
        poster: 'test.jpg',
        genre_name: genre.name,
      });
    });
    it('should throw error that movie not found', async () => {
      try {
        await service.create(
          {
            name: 'tests',
            age: 20,
            description: 'tests.',
            image: 'image.jpg',
          },
          movie.id + 1,
        );
      } catch (err) {
        expect(err.message).toBe('Movie not found');
        expect(err).toBeInstanceOf(NotFoundError);
      }
    });

    it('should create an actor', async () => {
      const actor = await service.create(
        {
          name: 'tests',
          age: 20,
          description: 'tests.',
          image: 'image.jpg',
        },
        movie.id,
      );
      expect(actor).toBeDefined();
      expect(actor.name).toBe('tests');
      expect(actor.age).toBe(20);
      expect(actor.description).toBe('tests.');
    });
    it('should throw error that actor is exist', async () => {
      try {
        await service.create(
          {
            name: 'tests',
            age: 20,
            description: 'tests.',
            image: 'image.jpg',
          },
          movie.id,
        );
      } catch (err) {
        expect(err.message).toBe('Actor is exist');
        expect(err).toBeInstanceOf(RecordIsExistError);
      }
    });
  });
  describe('Delete actor tests', () => {
    let actorId;
    let movie;
    let genre;
    beforeAll(async () => {
      genre = await genreService.create({
        name: 'test3',
        description: 'test',
      });
      movie = await movieService.createMovie({
        title: 'testf',
        description: 'test.',
        budget: '2000$',
        year: 2020,
        country: 'USA',
        poster: 'test.jpg',
        genre_name: genre.name,
      });
      actorId = await service.create(
        {
          name: 'deleted',
          age: 20,
          description: 'tests.',
          image: 'image.jpg',
        },
        movie.id,
      );
    });
    it('should delete actor ', async () => {
      const actor = await service.delete(actorId.id);
      expect(actor).toBe('Actor was deleted');
    });
    it('should throw error that actor not found', async () => {
      try {
        await service.delete(actorId.id + 1);
      } catch (err) {
        expect(err.message).toBe('Actor not found');
        expect(err).toBeInstanceOf(NotFoundError);
      }
    });
  });
});
