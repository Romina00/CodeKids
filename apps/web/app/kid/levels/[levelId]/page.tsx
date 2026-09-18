import { LevelGame } from './level-game';

export default async function LevelPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  return <LevelGame key={levelId} levelId={Number(levelId)} />;
}
