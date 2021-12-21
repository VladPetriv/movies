import { Test } from '@nestjs/testing';
import { Repository, getRepository, getConnection } from 'typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/user.entity';
import { RolesService } from '../../roles/roles.service';
import { Role } from '../../roles/roles-entity';
import { TestHelper } from '../../util/test-helper';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;
  let userRepository: Repository<User>;
  let roleService: RolesService;
  let roleRepository: Repository<Role>;
  const connectionName = 'tests';
  const testHelper = new TestHelper(connectionName, [User, Role]);

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
      ],
    }).compile();

    const connection = await testHelper.createTestConnection();

    roleRepository = getRepository(Role, connectionName);
    roleService = new RolesService(roleRepository);
    userRepository = getRepository(User, connectionName);
    userService = new UsersService(userRepository, roleService);
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
