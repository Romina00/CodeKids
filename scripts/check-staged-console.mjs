import { execFileSync } from 'node:child_process';

const diff = execFileSync(
  'git',
  [
    'diff',
    '--cached',
    '--unified=0',
    '--diff-filter=ACMR',
    '--',
    '*.ts',
    '*.tsx',
  ],
  { encoding: 'utf8' },
);

const violations = diff
  .split(/\r?\n/)
  .filter((line) => line.startsWith('+') && !line.startsWith('+++'))
  .filter((line) => /\bconsole\.log\s*\(/.test(line));

if (violations.length > 0) {
  process.stderr.write(
    [
      'Commit blocked: remove console.log from staged TypeScript changes.',
      ...violations.map((line) => `  ${line.slice(1).trim()}`),
      '',
    ].join('\n'),
  );
  process.exitCode = 1;
}
