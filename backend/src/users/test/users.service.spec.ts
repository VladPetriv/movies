import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, getConnection, getRepository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from '../users.service';
import { User } from '../user.entity';
import { Role } from '../../roles/roles.entity';
import { RolesService } from '../../roles/roles.service';
import { TestHelper } from '../../util/test-helper';
import { FavouriteService } from '../../favourite/favourite.service';
import { Favourite } from '../../favourite/entities/favourite.entity';
import { FavouriteItem } from '../../favourite/entities/favourite-item.entity';
import { MoviesService } from '../../movies/movies.service';
import { Movie } from '../../movies/movie.entity';
import { FilesService } from '../../files/files.service';
import { FilesModule } from '../../files/files.module';
import { Actor } from '../../actors/actor.entity';
import { Genre } from '../../genres/genre.entity';

describe('UsersService', () => {
  let userService: UsersService;
  let roleService: RolesService;
  let movieService: MoviesService;
  let movieRepository: Repository<Movie>;
  let favouriteService: FavouriteService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;
  let favouriteRepository: Repository<Favourite>;
  let favouriteItemRepository: Repository<FavouriteItem>;

  const connectionName = 'tests';

  const testHelper = new TestHelper(connectionName, [
    Role,
    User,
    Favourite,
    FavouriteItem,
    Movie,
    Actor,
    Genre,
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

    userRepository = getRepository(User, connectionName);
    roleRepository = getRepository(Role, connectionName);
    favouriteRepository = getRepository(Favourite, connectionName);
    favouriteItemRepository = getRepository(FavouriteItem, connectionName);
    movieRepository = getRepository(Movie, connectionName);
    movieService = new MoviesService(movieRepository, new FilesService());
    favouriteService = new FavouriteService(
      favouriteRepository,
      favouriteItemRepository,
      movieService,
    );
    roleService = new RolesService(roleRepository);
    userService = new UsersService(
      userRepository,
      roleService,
      favouriteService,
    );
    return connection;
  });
  afterAll(async () => {
    await getConnection(connectionName).close();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('Get all users test', () => {
    it('should return array of all users', async () => {
      const users = await userService.getAllUsers();

      expect(users).toBeDefined();
      expect(users).toStrictEqual([]);
    });
  });

  describe('Create user test', () => {
    const email = 'test@test.com';
    const password = 'test';
    const roleValue = 'USER';
    const roleDescription = 'Simple user';

    beforeEach(async () => {
      await roleService.create({
        value: roleValue,
        description: roleDescription,
      });
    });

    it('should create user', async () => {
      const user = await userService.createUser({
        email,
        password,
      });

      expect(user).toBeDefined();
      expect(user.email).toBe(email);
      expect(user.password).toBe(password);
      expect(user.ban).toBe(false);
      expect(user['roles']).toBeDefined();
      expect(user['favourite']).toBeDefined();
    });
  });
  describe('Get user by email test', () => {
    const email = 'test@test.com';
    const password = 'test';

    it('should return user by email', async () => {
      const user = await userService.getUserByEmail(email);
      expect(user).toBeDefined();
      expect(user.email).toBe(email);
      expect(user.password).toBe(password);
      expect(user.ban).toBe(false);
    });
  });
  describe('Ban user test', () => {
    const email = 'test1@test.com';
    const password = 'test';
    const banReason = 'Using bad words';
    let createdUser: User;

    beforeEach(async () => {
      createdUser = await userService.createUser({ email, password });
    });
    it('should ban user', async () => {
      const user = await userService.banUser({
        userId: createdUser.id,
        reason: banReason,
      });

      expect(user).toBeDefined();
      expect(user.ban).toBe(true);
      expect(user.banReason).toBe(banReason);
    });
  });
  describe('Add role test', () => {
    const email = 'test2@test.com';
    const password = 'test';
    const newRoleValue = 'ADMIN';
    const newRoleDescription = 'Super user';
    let createdUser: User;

    beforeAll(async () => {
      await roleService.create({
        value: newRoleValue,
        description: newRoleDescription,
      });
      createdUser = await userService.createUser({ email, password });
    });
    it('should add new role for user', async () => {
      const user = await userService.addRole({
        userId: createdUser.id,
        value: 'ADMIN',
      });

      expect(user).toBeDefined();
      expect(user['roles'].length).toBe(2);
      expect(user['roles'][1].value).toBe(newRoleValue);
    });
    it('should throw an error that role not exist', async () => {
      try {
        await userService.addRole({
          userId: createdUser.id,
          value: '',
        });
      } catch (err) {
        expect(err.message).toBe('User or role not found');
      }
    });
    it('should throw an error that user not exist', async () => {
      try {
        await userService.addRole({
          userId: 123,
          value: 'ADMIN',
        });
      } catch (err) {
        expect(err.message).toBe('User or role not found');
      }
    });
  });
  describe('Delete user test', () => {
    const email = 'test2@test.com';
    it('should detele user', async () => {
      const user = await userService.deleteUser(email);
      expect(user).toBeDefined();
      expect(user).toBe('User was deleted');
    });
  });
});
