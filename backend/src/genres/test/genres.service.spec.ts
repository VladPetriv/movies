import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getConnection, getRepository, Repository } from 'typeorm';
import { TestHelper } from '../../util/test-helper';
import { Genre } from '../genre.entity';
import { GenresService } from '../genres.service';
import { HttpException } from '@nestjs/common';

describe('GenresService', () => {
  let service: GenresService;
  let genreRepository: Repository<Genre>;

  const connectionName = 'tests';
  const testHelper = new TestHelper(connectionName, [Genre]);

  beforeAll(async () => {
    await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.${process.env.NODE_ENV}.env`,
        }),
      ],
      providers: [
        GenresService,
        {
          provide: getRepositoryToken(Genre),
          useClass: Repository,
        },
      ],
    }).compile();

    const connection = await testHelper.createTestConnection();

    genreRepository = getRepository(Genre, connectionName);
    service = new GenresService(genreRepository);

    return connection;
  });
  afterAll(async () => {
    await getConnection(connectionName).close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return all genres', async () => {
    const genres = await service.getAll();

    expect(genres).toBeDefined();
    expect(genres).toStrictEqual([]);
  });
  describe('Get one genre tests', () => {
    let genreId;
    beforeAll(async () => {
      genreId = await service.create({ name: 'test1', description: 'test' });
    });
    it('should return genre by id', async () => {
      const genre = await service.getOne(genreId.id);

      expect(genre).toBeDefined();
      expect(genre.id).toBe(genreId.id);
      expect(genre.name).toBe('test1');
      expect(genre.description).toBe('test');
    });
    it('should throw an error that genre not found', async () => {
      try {
        await service.getOne(genreId.id + 1);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toBe('Genre not found');
      }
    });
  });
  describe('Create genre tests', () => {
    let genreId;
    beforeAll(async () => {
      genreId = await service.create({ name: 'test2', description: 'test' });
    });
    it('should create genre and return it', async () => {
      const genre = await service.create({
        name: 'test3',
        description: 'test',
      });

      expect(genre).toBeDefined();
      expect(genre.name).toBe('test3');
      expect(genre.description).toBe('test');
    });
    it('should throw an error that genre is exist', async () => {
      try {
        await service.create({ name: 'test3', description: 'test' });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toBe('Genre is exist');
      }
    });
  });
  describe('Delete genre tests', () => {
    let genreId;
    beforeAll(async () => {
      genreId = await service.create({ name: 'test4', description: 'test' });
    });
    it('should delete genre and return message', async () => {
      const genre = await service.delete(genreId.id);

      expect(genre).toBe('Genre was deleted');
    });
    it('should throw an error that genre not found', async () => {
      try {
        await service.delete(genreId.id + 1);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toBe('Genre not found');
      }
    });
  });
});
