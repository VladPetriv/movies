import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Repository,
  createConnection,
  getConnection,
  getRepository,
} from 'typeorm';
import { UsersService } from '../users.service';
import { User } from '../user.entity';
import { Role } from '../../roles/roles-entity';
import { RolesService } from '../../roles/roles.service';
import { TestHelper } from '../../util/test-helper';
import { ConfigModule } from '@nestjs/config';

describe('UsersService', () => {
  let userService: UsersService;
  let roleService: RolesService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;
  const connectionName = 'tests';

  const testHelper = new TestHelper(connectionName, [Role, User]);

  beforeEach(async () => {
    await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.${process.env.NODE_ENV}.env`,
        }),
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
      ],
    }).compile();

    const connection = await testHelper.createTestConnection();

    userRepository = getRepository(User, connectionName);
    roleRepository = getRepository(Role, connectionName);
    userService = new UsersService(
      userRepository,
      new RolesService(roleRepository),
    );
    roleService = new RolesService(roleRepository);
    return connection;
  });
  afterEach(async () => {
    await getConnection(connectionName).close();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
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
      expect(user['roles'][0].value).toBe(roleValue);
      expect(user['roles'][0].description).toBe(roleDescription);
    });
  });
  describe('Get user by email test', () => {
    const email = 'test@test.com';
    const password = 'test';
    const roleValue = 'USER';
    const roleDescription = 'Simple user';

    beforeEach(async () => {
      await roleService.create({
        value: roleValue,
        description: roleDescription,
      });
      await userService.createUser({ email, password });
    });
    it('should return user by email', async () => {
      const user = await userService.getUserByEmail(email);
      expect(user).toBeDefined();
      expect(user.email).toBe(email);
      expect(user.password).toBe(password);
      expect(user.ban).toBe(false);
    });
  });
  describe('Get all users test', () => {
    it('should return array of all users', async () => {
      const users = await userService.getAllUsers();
      expect(users).toBeDefined();
      expect(users).toStrictEqual([]);
    });
  });
  describe('Ban user test', () => {
    const email = 'test@test.com';
    const password = 'test';
    const roleValue = 'USER';
    const roleDescription = 'Simple user';
    const banReason = 'Using bad words';
    let createdUser: User;

    beforeEach(async () => {
      await roleService.create({
        value: roleValue,
        description: roleDescription,
      });
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
});
