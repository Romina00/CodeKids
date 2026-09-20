'use client';

import { Button } from '@repo/ui/button';
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/dialog';
import { BookOpen, Icon } from '@repo/ui/icon';

export function LearningOverview() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="inline-flex items-center justify-center min-h-[3rem] gap-[0.5rem] pt-[0.75rem] pr-[1.2rem] pb-[0.75rem] pl-[1.2rem] rounded-[0.8rem] text-[length:0.9rem] font-[number:750] [transition:transform_160ms_ease,_box-shadow_160ms_ease,_background_160ms_ease] bg-[#fff] border-[length:1px] border-solid border-[color:#cfdeed] motion-reduce:[transition:none] [&:focus-visible]:[outline:3px_solid_var(--color-focus-ring)] [&:focus-visible]:outline-offset-[3px]"
          type="button"
        >
          <Icon icon={BookOpen} size="sm" /> Explore the learning journey
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Your child’s learning journey</DialogTitle>
        <DialogDescription>
          A parent’s guide to the 15 beginner levels for ages 10–15.
        </DialogDescription>
        <section className="grid gap-3 leading-[var(--line-height-relaxed)] [&_h3]:text-[length:var(--font-size-lg)] [&_h3]:font-bold [&_p]:text-[color:var(--color-text-muted)]">
          <h3>What will my child explore?</h3>
          <p>
            <strong>Levels 1–3:</strong> Put commands in order and discover
            repetition by guiding characters, preparing a pizza and reaching
            treasure.
          </p>
          <p>
            <strong>Levels 4–8:</strong> Explore AND and OR, change a coin
            variable, distinguish numbers, text and booleans, and choose actions
            based on conditions.
          </p>
          <p>
            <strong>Levels 9–14:</strong> Use loops to clean tiles, nest loops
            to fill a garden, build a flowchart, arrange a mission plan, test
            castle parts and define a reusable spell function.
          </p>
          <p>
            <strong>Level 15:</strong> Combine these ideas in a treasure mini
            game. Choose a distance and reward goal, build a program and test
            the same program with and without a key.
          </p>
        </section>
        <section className="grid gap-3 leading-[var(--line-height-relaxed)] [&_h3]:text-[length:var(--font-size-lg)] [&_h3]:font-bold [&_p]:text-[color:var(--color-text-muted)]">
          <h3>How does a level work?</h3>
          <p>
            Read the goal, click commands or values, then run or check the
            solution. Several levels include multiple tasks or tests. Children
            can adjust their choices and try again before completing the level.
          </p>
          <p>
            Completing a level saves progress, awards XP and unlocks the next
            level. Milestone badges appear on the child’s profile.
          </p>
        </section>
        <section className="grid gap-3 leading-[var(--line-height-relaxed)] [&_h3]:text-[length:var(--font-size-lg)] [&_h3]:font-bold [&_p]:text-[color:var(--color-text-muted)]">
          <h3>How does Milo help?</h3>
          <p>
            Milo is a game guide with written explanations and task-specific
            hints. His messages follow the game’s current task and result; he is
            not an open-ended chat tutor.
          </p>
          <p>
            <strong>Ready:</strong> Milo introduces the task. Where a guided
            introduction is available, children can step through it and use “Ask
            Milo” to read it again.
          </p>
          <p>
            <strong>Thinking:</strong> Milo encourages children to review a
            choice or try another approach. “Show hint” reveals a clue for the
            current task.
          </p>
          <p>
            <strong>Happy:</strong> Milo celebrates a successful step or test. A
            level with several tests is complete once all its required tasks are
            passed.
          </p>
        </section>
        <DialogActions>
          <DialogClose asChild>
            <Button variant="primary">Got it</Button>
          </DialogClose>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
