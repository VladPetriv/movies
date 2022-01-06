import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { AuthGuard } from '../../auth/auth.guard';
import { RoleGuard } from '../../auth/roles.guard';
import { BanUserDto } from '../dto/ban-user.dto';

describe('UsersController', () => {
  let controller: UsersController;

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };
  const mockRoleGuard = {
    canActivate: jest.fn(() => true),
  };
  const mockUserService = {
    getAllUsers: jest.fn(() => []),
    createUser: jest.fn((dto: CreateUserDto) => {
      return {
        id: 1,
        ...dto,
      };
    }),
    banUser: jest.fn((dto: BanUserDto) => {
      return {
        id: dto.userId,
        email: 'test@test.com',
        password: 'test',
        ban: true,
        banReason: dto.reason,
      };
    }),
    deleteUser: jest.fn((user_email: string) => {
      return 'User was deleted';
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(RoleGuard)
      .useValue(mockRoleGuard)
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should return all users', () => {
    expect(controller.getAllUsers()).toStrictEqual([]);
  });
  it('should create new user', () => {
    expect(
      controller.create({
        email: 'test@test.com',
        password: 'test',
      }),
    ).toEqual({
      id: 1,
      email: 'test@test.com',
      password: 'test',
    });
  });
  it('should ban user', () => {
    expect(controller.banUser({ userId: 1, reason: 'test' })).toEqual({
      id: 1,
      email: 'test@test.com',
      password: 'test',
      ban: true,
      banReason: 'test',
    });
  });
  it('should delete user', () => {
    expect(controller.deleteUser('test@test.com'));
  });
});
