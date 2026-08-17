import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaveBlocklyWorkspaceDto } from '../dto/save-blockly-workspace.dto';
import { Activity, ActivityType } from '../entities/activity.entity';
import { BlocklyWorkspace } from '../entities/blockly-workspace.entity';

interface BlocklyRule {
  allowedBlockTypes: string[];
  requiredBlockTypes?: string[];
  minBlockCount?: number;
  maxBlockCount?: number;
}

@Injectable()
export class BlocklyService {
  constructor(
    @InjectRepository(Activity)
    private readonly activities: Repository<Activity>,
    @InjectRepository(BlocklyWorkspace)
    private readonly workspaces: Repository<BlocklyWorkspace>,
  ) {}

  async load(childId: number, activityId: number) {
    await this.requireTask(activityId);
    return (
      (await this.workspaces.findOneBy({ childId, activityId })) ?? {
        activityId,
        revision: 0,
        completed: false,
        workspace: { blocks: [] },
      }
    );
  }

  async save(
    childId: number,
    activityId: number,
    dto: SaveBlocklyWorkspaceDto,
  ) {
    const activity = await this.requireTask(activityId);
    const rule = this.readRule(activity);
    const workspace = this.sanitize(dto);
    const existing = await this.workspaces.findOneBy({ childId, activityId });
    const expectedRevision = existing?.revision ?? 0;
    if (dto.revision !== expectedRevision)
      throw new ConflictException(
        'Workspace revision is stale. Reload before saving.',
      );
    const completed = this.validateCompletion(workspace.blocks, rule);
    const record = existing
      ? this.workspaces.merge(existing, {
          workspace,
          revision: expectedRevision + 1,
          completed,
        })
      : this.workspaces.create({
          childId,
          activityId,
          workspace,
          revision: 1,
          completed,
        });
    return this.workspaces.save(record);
  }

  private async requireTask(id: number) {
    const activity = await this.activities.findOneBy({ id });
    if (!activity || activity.type !== ActivityType.BLOCKLY)
      throw new NotFoundException('Blockly activity not found.');
    return activity;
  }

  private readRule(activity: Activity): BlocklyRule {
    const candidate = activity.content?.blockly;
    if (!candidate || typeof candidate !== 'object')
      throw new BadRequestException('Blockly activity has no completion rule.');
    const rule = candidate as Partial<BlocklyRule>;
    if (
      !Array.isArray(rule.allowedBlockTypes) ||
      rule.allowedBlockTypes.length === 0 ||
      rule.allowedBlockTypes.some((value) => typeof value !== 'string')
    ) {
      throw new BadRequestException('Blockly completion rule is invalid.');
    }
    return rule as BlocklyRule;
  }

  private sanitize(dto: SaveBlocklyWorkspaceDto) {
    const blocks = dto.blocks.map((block) => {
      const fields = Object.fromEntries(
        Object.entries(block.fields ?? {}).map(([key, value]) => {
          if (
            key.length > 80 ||
            typeof value !== 'string' ||
            value.length > 500
          )
            throw new BadRequestException('Blockly field exceeds safe limits.');
          return [key, value];
        }),
      );
      return { id: block.id, type: block.type, fields };
    });
    if (new Set(blocks.map((block) => block.id)).size !== blocks.length)
      throw new BadRequestException('Blockly block IDs must be unique.');
    return { blocks };
  }

  private validateCompletion(
    blocks: Array<{ type: string }>,
    rule: BlocklyRule,
  ) {
    const allowed = new Set(rule.allowedBlockTypes);
    if (blocks.some((block) => !allowed.has(block.type)))
      throw new BadRequestException(
        'Workspace contains a block type not allowed for this activity.',
      );
    const min = rule.minBlockCount ?? 1;
    const max = Math.min(rule.maxBlockCount ?? 200, 200);
    if (blocks.length > max)
      throw new BadRequestException(
        'Workspace exceeds the activity block limit.',
      );
    return (
      blocks.length >= min &&
      (rule.requiredBlockTypes ?? []).every((type) =>
        blocks.some((block) => block.type === type),
      )
    );
  }
}
