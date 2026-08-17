import { AuthRateLimitService } from './auth-rate-limit.service';
describe('AuthRateLimitService', () => {
  it('limits repeated attempts per scope and client', () => {
    const service = new AuthRateLimitService();
    service.check('login', 'client', 2, 60_000);
    service.check('login', 'client', 2, 60_000);
    expect(() => service.check('login', 'client', 2, 60_000)).toThrow(
      'Too many authentication attempts',
    );
    expect(() => service.check('refresh', 'client', 2, 60_000)).not.toThrow();
  });
});
