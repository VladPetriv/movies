import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../../auth/auth.guard';
import { RoleGuard } from '../../auth/roles.guard';
import { ActorsController } from '../actors.controller';
import { FilesModule } from '../../files/files.module';
import { ActorsService } from '../actors.service';
import { CreateActorDto } from '../dto/create-actor.dto';
import { MoviesService } from '../../movies/movies.service';

describe('ActorsController', () => {
  let controller: ActorsController;
  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };
  const mockRolesGuard = {
    canActivate: jest.fn(() => true),
  };
  const mockMovieService = {
    getOneMovie: jest.fn((movie_id: number) => {
      return {
        id: movie_id,
        title: 'test',
        description: 'test.',
        budget: '2000$',
        year: 2020,
        country: 'USA',
        poster: 'test.jpg',
      };
    }),
  };
  const mockActorService = {
    getAll: jest.fn(() => []),
    getOneById: jest.fn((actor_id) => {
      return {
        id: Number(actor_id),
        name: 'test',
        age: 20,
        description: 'test.',
        image: 'test.jpg',
      };
    }),
    create: jest.fn((dto: CreateActorDto, movie_id: number) => {
      return {
        id: 23,
        ...dto,
        movie: movie_id,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FilesModule],
      controllers: [ActorsController],
      providers: [ActorsService],
    })
      .overrideProvider(ActorsService)
      .useValue(mockActorService)
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(RoleGuard)
      .useValue(mockRolesGuard)
      .overrideProvider(MoviesService)
      .useValue(mockMovieService)
      .compile();

    controller = module.get<ActorsController>(ActorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should return all actors', async () => {
    expect(await controller.getAllActors()).toStrictEqual([]);
  });
  it('should return user by id', async () => {
    expect(await controller.getOneActor('1')).toStrictEqual({
      id: 1,
      name: 'test',
      age: 20,
      description: 'test.',
      image: 'test.jpg',
    });
  });
  it('should create user', async () => {
    expect(
      await controller.createActor(
        '1',
        {
          name: 'test',
          age: 20,
          description: 'test.',
          image: 'test.jpg',
        },
        'test.jpg',
      ),
    ).toEqual({
      id: 23,
      name: 'test',
      age: 20,
      description: 'test.',
      image: 'test.jpg',
      movie: 1,
    });
  });
});
