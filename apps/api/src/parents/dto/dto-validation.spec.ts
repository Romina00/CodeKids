import { validate } from 'class-validator';
import { CreateChildDto } from './create-child.dto';
import { UpdateChildDto } from './update-child.dto';

describe('parent DTO validation', () => {
  it('rejects an incomplete child profile', async () => {
    const dto = Object.assign(new CreateChildDto(), {
      nickname: '',
      avatar: '',
      birthYear: 1800,
    });

    const errors = await validate(dto);

    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['nickname', 'avatar', 'birthYear']),
    );
  });

  it('allows a partial child profile update', async () => {
    const dto = Object.assign(new UpdateChildDto(), { nickname: 'Ada' });

    await expect(validate(dto)).resolves.toEqual([]);
  });
});
