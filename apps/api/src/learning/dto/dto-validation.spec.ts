import { validate } from 'class-validator';
import { CreateLevelDto } from './create-level.dto';
import { CreateActivityDto } from './create-activity.dto';
import { UpdateLevelDto } from './update-level.dto';

describe('learning content DTO validation', () => {
  it('rejects invalid level identifiers, missing titles, and negative positions', async () => {
    const errors = await validate(
      Object.assign(new CreateLevelDto(), {
        slug: 'Invalid Slug',
        title: '',
        position: -1,
        published: 'yes',
      }),
    );
    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['slug', 'title', 'position', 'published']),
    );
  });

  it('allows unpublishing and removing a prerequisite in a partial update', async () => {
    await expect(
      validate(
        Object.assign(new UpdateLevelDto(), {
          published: false,
          prerequisiteLevelId: null,
        }),
      ),
    ).resolves.toEqual([]);
  });

  it('rejects invalid activity types, content arrays, and negative duration', async () => {
    const errors = await validate(
      Object.assign(new CreateActivityDto(), {
        title: 'Lesson',
        type: 'UNKNOWN',
        content: [],
        position: 1,
        estimatedMinutes: -1,
      }),
    );
    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['type', 'content', 'estimatedMinutes']),
    );
  });
});
