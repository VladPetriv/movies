import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { CreateUserDto } from '../../users/dto/creat-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    registration: jest.fn((dto: CreateUserDto) => {
      return {
        token: `${dto}token`,
      };
    }),
    login: jest.fn((dto: CreateUserDto) => {
      return {
        token: `${dto}token`,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should register user and return jwt token', () => {
    expect(
      controller.registration({
        email: 'test@test.com',
        password: 'test',
      }),
    ).toEqual({
      token: `${{ email: 'test@test.com', password: 'test' }}token`,
    });
  });
  it('should login user and return jwt token', () => {
    expect(
      controller.login({
        email: 'test@test.com',
        password: 'test',
      }),
    ).toEqual({
      token: `${{ email: 'test@test.com', password: 'test' }}token`,
    });
  });
});
