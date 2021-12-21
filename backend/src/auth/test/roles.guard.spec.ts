import { RoleGuard } from '../roles.guard';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new RoleGuard()).toBeDefined();
  });
});
