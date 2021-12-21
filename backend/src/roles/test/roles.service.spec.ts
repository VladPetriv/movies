import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TestHelper } from '../../util/test-helper';
import { getConnection, Repository, getRepository } from 'typeorm';
import { Role } from '../roles-entity';
import { RolesService } from '../roles.service';

describe('RolesService', () => {
  let service: RolesService;
  let rolesRepository: Repository<Role>;
  const connectionName = 'tests';

  const testHelper = new TestHelper(connectionName, [Role]);

  beforeEach(async () => {
    await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.${process.env.NODE_ENV}.env`,
        }),
      ],
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
      ],
    }).compile();

    const connection = await testHelper.createTestConnection();

    rolesRepository = getRepository(Role, connectionName);
    service = new RolesService(rolesRepository);
    return connection;
  });

  afterEach(async () => {
    await getConnection(connectionName).close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create role test', () => {
    const value = 'USER';
    const description = 'Simple user';

    it('should create role', async () => {
      const role = await service.create({ value, description });
      expect(role).toBeDefined();
      expect(role.value).toBe(value);
      expect(role.description).toBe(description);
    });
  });
  describe('Get role by value test', () => {
    const value = 'USER';
    const description = 'Simple user';
    beforeEach(async () => {
      await service.create({ value, description });
    });

    it('should return role by value', async () => {
      const role = await service.getRoleByValue(value);
      expect(role).toBeDefined();
      expect(role.value).toBe(value);
      expect(role.description).toBe(description);
    });
  });
});
