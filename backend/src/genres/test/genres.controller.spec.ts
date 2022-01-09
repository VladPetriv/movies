import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../../auth/auth.guard';
import { AuthModule } from '../../auth/auth.module';
import { RoleGuard } from '../../auth/roles.guard';
import { CreateGenreDto } from '../dto/create-genre.dto';
import { GenresController } from '../genres.controller';
import { GenresService } from '../genres.service';

describe('GenresController', () => {
  let controller: GenresController;
  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };
  const mockRoleGuard = {
    canActivate: jest.fn(() => true),
  };
  const mockGenreService = {
    getAll: jest.fn(() => []),
    getOne: jest.fn((genre_id: number) => {
      return {
        id: genre_id,
        name: 'test1',
        description: 'test',
      };
    }),
    create: jest.fn((dto: CreateGenreDto) => {
      return {
        id: 1,
        ...dto,
      };
    }),
    delete: jest.fn((genre_id: number) => 'Genre was deleted'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenresController],
      providers: [GenresService],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(RoleGuard)
      .useValue(mockRoleGuard)
      .overrideProvider(GenresService)
      .useValue(mockGenreService)
      .compile();

    controller = module.get<GenresController>(GenresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should return all genres', async () => {
    expect(await controller.getAllGenres()).toStrictEqual([]);
  });
  it('should return genre by id', async () => {
    expect(await controller.getOneGenre('1')).toEqual({
      id: 1,
      name: 'test1',
      description: 'test',
    });
  });
  it('should create genre and return it', async () => {
    expect(
      await controller.createGenre({ name: 'test2', description: 'test' }),
    ).toEqual({
      id: 1,
      name: 'test2',
      description: 'test',
    });
  });
  it('should delete genre and return message', async () => {
    expect(await controller.deleteGenre('1')).toEqual('Genre was deleted');
  });
});
