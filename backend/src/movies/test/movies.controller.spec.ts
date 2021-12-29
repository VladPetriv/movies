import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../../auth/auth.guard';
import { RoleGuard } from '../../auth/roles.guard';
import { FilesModule } from '../../files/files.module';
import { FilesService } from '../../files/files.service';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { MoviesController } from '../movies.controller';
import { MoviesService } from '../movies.service';

describe('MoviesController', () => {
  let controller: MoviesController;

  const mockAuthGuard = {
    canActivate: jest.fn((): boolean => true),
  };
  const mockRoleGuard = {
    conActivate: jest.fn((): boolean => true),
  };
  const mockFileService = {
    createFile: jest.fn((file) => file),
  };
  const mockMovieService = {
    getAllMovies: jest.fn(() => {
      return [];
    }),
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
    createMovie: jest.fn((createMovieDto: CreateMovieDto) => {
      return {
        id: 1,
        ...createMovieDto,
      };
    }),
    deleteMovie: jest.fn((movie_id: number) => {
      return 'Movie was deleted';
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FilesModule],
      controllers: [MoviesController],
      providers: [MoviesService],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(RoleGuard)
      .useValue(mockRoleGuard)
      .overrideProvider(MoviesService)
      .useValue(mockMovieService)
      .overrideProvider(FilesService)
      .useValue(mockFileService)
      .compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should create movie', () => {
    expect(
      controller.createMovie(
        {
          title: 'test',
          description: 'test.',
          budget: '2000$',
          year: 2020,
          country: 'USA',
          poster: 'test.jpg',
        },
        'test.jpg',
      ),
    ).toEqual({
      id: 1,
      title: 'test',
      description: 'test.',
      budget: '2000$',
      year: 2020,
      country: 'USA',
      poster: 'test.jpg',
    });
  });
  it('should return all movies', () => {
    expect(controller.getAllMovies()).toStrictEqual([]);
  });
  it('should return movie by id', () => {
    expect(controller.getOneMovie('1')).toEqual({
      id: 1,
      title: 'test',
      description: 'test.',
      budget: '2000$',
      year: 2020,
      country: 'USA',
      poster: 'test.jpg',
    });
  });
  it('should delete movie', () => {
    expect(controller.deleteMovie('1')).toEqual('Movie was deleted');
  });
});
