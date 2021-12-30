import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { HttpException } from '@nestjs/common';
import { getConnection, getRepository, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Actor } from '../actor.entity';
import { ActorsService } from '../actors.service';
import { FilesModule } from '../../files/files.module';
import { FilesService } from '../../files/files.service';
import { TestHelper } from '../../util/test-helper';

describe('ActorsService', () => {
  let service: ActorsService;
  let actorRepository: Repository<Actor>;

  const connectionName = 'tests';
  const testHelper = new TestHelper(connectionName, [Actor]);

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
      ],
    }).compile();
    const connection = await testHelper.createTestConnection();
    actorRepository = getRepository(Actor, connectionName);
    service = new ActorsService(actorRepository, new FilesService());
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
    beforeAll(async () => {
      actorId = await service.create({
        name: 'test',
        age: 20,
        description: 'tests.',
        image: 'test.jpg',
      });
    });
    it('should return actor by id', async () => {
      const actor = await service.getOneById(actorId.id);
      expect(actor).toBeDefined();
      expect(actor.id).toBe(actorId.id);
      expect(actor.name).toBe('test');
      expect(actor.age).toBe(20);
      expect(actor.description).toBe('tests.');
    });
    it('should throw an error that actor not found', async () => {
      try {
        await service.getOneById(actorId.id + 1);
      } catch (err) {
        console.log(err);
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toBe('Actor not found');
      }
    });
  });
  describe('Create actor tests', () => {
    it('should create an actor', async () => {
      const actor = await service.create({
        name: 'tests',
        age: 20,
        description: 'tests.',
        image: 'image.jpg',
      });
      expect(actor).toBeDefined();
      expect(actor.name).toBe('tests');
      expect(actor.age).toBe(20);
      expect(actor.description).toBe('tests.');
    });
    it('should throw an error that actor is exist', async () => {
      try {
        await service.create({
          name: 'test',
          age: 20,
          description: 'tests.',
          image: 'image.jpg',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toBe('Actor is exist');
      }
    });
  });
  describe('Delete actor tests', () => {
    let actorId;
    beforeAll(async () => {
      actorId = await service.create({
        name: 'deleted',
        age: 20,
        description: 'tests.',
        image: 'image.jpg',
      });
    });
    it('should delete actor ', async () => {
      const actor = await service.delete(actorId.id);
      expect(actor).toBe('Actor was deleted');
    });
    it('should throw an error that actor not found', async () => {
      try {
        await service.delete(actorId.id + 1);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toBe('Actor not found');
      }
    });
  });
});
