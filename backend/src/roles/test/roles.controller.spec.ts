import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from '../roles.controller';
import { RolesService } from '../roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';

describe('RolesController', () => {
  let controller: RolesController;
  const mockRolesService = {
    create: jest.fn((dto: CreateRoleDto) => {
      return {
        ...dto,
        id: Date.now(),
      };
    }),
    getRoleByValue: jest.fn((value: string) => {
      return {
        id: Date.now(),
        value,
        description: 'some description',
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [RolesService],
    })
      .overrideProvider(RolesService)
      .useValue(mockRolesService)
      .compile();

    controller = module.get<RolesController>(RolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should create a role', async () => {
    expect(
      await controller.create({
        value: 'USER',
        description: 'Simple user',
      }),
    ).toEqual({
      id: expect.any(Number),
      value: 'USER',
      description: 'Simple user',
    });
  });
  it('should return role by value', async () => {
    const value = 'test';
    expect(await controller.getByValue(value)).toEqual({
      id: expect.any(Number),
      value,
      description: 'some description',
    });
  });
});
