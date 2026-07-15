import { BadRequestException, ConflictException } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { Activity, ActivityType } from '../entities/activity.entity';
import { BlocklyWorkspace } from '../entities/blockly-workspace.entity';
import { BlocklyService } from './blockly.service';

describe('BlocklyService', () => {
  let activities: jest.Mocked<Repository<Activity>>;
  let workspaces: jest.Mocked<Repository<BlocklyWorkspace>>;
  let service: BlocklyService;

  beforeEach(() => {
    activities = repositoryMock<Activity>();
    workspaces = repositoryMock<BlocklyWorkspace>();
    service = new BlocklyService(activities, workspaces);
    activities.findOneBy.mockResolvedValue({
      id: 4,
      type: ActivityType.BLOCKLY,
      content: {
        blockly: {
          allowedBlockTypes: ['move', 'repeat'],
          requiredBlockTypes: ['repeat'],
          minBlockCount: 2,
          maxBlockCount: 5,
        },
      },
    } as unknown as Activity);
    workspaces.create.mockImplementation((value) => value as BlocklyWorkspace);
    workspaces.save.mockImplementation((value) =>
      Promise.resolve({ id: 1, ...value } as BlocklyWorkspace),
    );
  });

  it('sanitizes and saves an allowed workspace with server-derived completion', async () => {
    workspaces.findOneBy.mockResolvedValue(null);
    await expect(
      service.save(7, 4, {
        revision: 0,
        blocks: [
          { id: 'a', type: 'move', fields: { steps: '2' } },
          { id: 'b', type: 'repeat' },
        ],
      }),
    ).resolves.toMatchObject({ revision: 1, completed: true });
  });

  it('rejects unapproved block types and stale revisions', async () => {
    workspaces.findOneBy.mockResolvedValueOnce(null);
    await expect(
      service.save(7, 4, {
        revision: 0,
        blocks: [{ id: 'x', type: 'script' }],
      }),
    ).rejects.toThrow(BadRequestException);
    workspaces.findOneBy.mockResolvedValueOnce({
      revision: 2,
    } as BlocklyWorkspace);
    await expect(
      service.save(7, 4, { revision: 1, blocks: [] }),
    ).rejects.toThrow(ConflictException);
  });

  it('returns an empty revision-zero workspace for a first load', async () => {
    workspaces.findOneBy.mockResolvedValue(null);
    await expect(service.load(7, 4)).resolves.toEqual({
      activityId: 4,
      revision: 0,
      completed: false,
      workspace: { blocks: [] },
    });
  });
});

function repositoryMock<T extends ObjectLiteral>(): jest.Mocked<Repository<T>> {
  return {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
  } as unknown as jest.Mocked<Repository<T>>;
}
