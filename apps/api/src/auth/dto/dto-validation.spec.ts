import { validate } from 'class-validator';
import { LoginDto } from './login.dto';
import { RegisterParentDto } from './register-parent.dto';

describe('authentication DTO validation', () => {
  it('rejects an invalid parent registration payload', async () => {
    const dto = Object.assign(new RegisterParentDto(), {
      email: 'not-an-email',
      password: 'weak',
      confirmPassword: 'different',
    });

    const errors = await validate(dto);

    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['email', 'password']),
    );
  });

  it('accepts a valid login payload', async () => {
    const dto = Object.assign(new LoginDto(), {
      email: 'parent@example.com',
      password: 'StrongPass1',
    });

    await expect(validate(dto)).resolves.toEqual([]);
  });
});
