import { Test } from '@nestjs/testing';
import { Repository, getRepository, getConnection } from 'typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/user.entity';
import { RolesService } from '../../roles/roles.service';
import { Role } from '../../roles/roles.entity';
import { TestHelper } from '../../util/test-helper';
import { Favourite } from '../../favourite/entities/favourite.entity';
import { FavouriteItem } from '../../favourite/entities/favourite-item.entity';
import { FavouriteService } from '../../favourite/favourite.service';
import { MoviesService } from '../../movies/movies.service';
import { Movie } from '../../movies/movie.entity';
import { FilesModule } from '../../files/files.module';
import { FilesService } from '../../files/files.service';
import { Actor } from '../../actors/actor.entity';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;
  let userRepository: Repository<User>;
  let roleService: RolesService;
  let roleRepository: Repository<Role>;
  let favouriteRepository: Repository<Favourite>;
  let favouriteItemsRepository: Repository<FavouriteItem>;
  let favouriteService: FavouriteService;
  let movieRepository: Repository<Movie>;
  let movieService: MoviesService;

  const connectionName = 'tests';
  const testHelper = new TestHelper(connectionName, [
    User,
    Role,
    Favourite,
    FavouriteItem,
    Movie,
    Actor,
  ]);

  beforeEach(async () => {
    await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.${process.env.NODE_ENV}.env`,
        }),
        JwtModule.register({
          secret: process.env.SECRET_KEY,
          signOptions: {
            expiresIn: '5m',
          },
        }),
        FilesModule,
      ],
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(User),
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
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useClass: Repository,
        },
      ],
    }).compile();

    const connection = await testHelper.createTestConnection();

    roleRepository = getRepository(Role, connectionName);
    roleService = new RolesService(roleRepository);
    userRepository = getRepository(User, connectionName);
    favouriteRepository = getRepository(Favourite, connectionName);
    favouriteItemsRepository = getRepository(FavouriteItem, connectionName);
    movieRepository = getRepository(Movie, connectionName);
    movieService = new MoviesService(movieRepository, new FilesService());
    favouriteService = new FavouriteService(
      favouriteRepository,
      favouriteItemsRepository,
      movieService,
    );
    userService = new UsersService(
      userRepository,
      roleService,
      favouriteService,
    );
    service = new AuthService(userService, new JwtService({}));
    return connection;
  });

  afterEach(async () => {
    await getConnection(connectionName).close();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('Registration test', () => {
    const email = 'test@test.com';
    const password = 'test';

    beforeEach(async () => {
      await roleService.create({ value: 'USER', description: 'Simple user' });
    });

    it('should register new user and return token', async () => {
      const user = await service.registration({ email, password });
      expect(user).toBeDefined();
      expect(user.token).toBeDefined();
    });
  });
  describe('Login test', () => {
    const email = 'test@test.com';
    const password = 'test';

    beforeEach(async () => {
      await roleService.create({ value: 'USER', description: 'Simple user' });
      await service.registration({ email, password });
    });

    it('should login user and return jwt token', async () => {
      const user = await service.login({ email, password });
      expect(user).toBeDefined();
      expect(user.token).toBeDefined();
    });
  });
});
