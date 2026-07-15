import { config as baseConfig } from '@repo/eslint-config/base';

export default [
  {
    ignores: [
      '**/.next/**',
      '**/coverage/**',
      '**/dist/**',
      '**/node_modules/**',
      'eslint.config.mjs',
    ],
  },
  ...baseConfig,
];
