/* eslint-disable turbo/no-undeclared-env-vars -- CLI-only credentials are intentionally excluded from Turbo's shared environment. */
import bcrypt from 'bcrypt';
import dataSource from './data-source';
import { Role, User } from './users/entities/user.entity';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readAdminInput() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? '';
  const displayName = process.env.ADMIN_NAME?.trim() || 'Administrator';

  if (!email || !emailPattern.test(email)) {
    throw new Error('ADMIN_EMAIL must contain a valid email address.');
  }

  const strongPassword =
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password);

  if (!strongPassword) {
    throw new Error(
      'ADMIN_PASSWORD must be at least 8 characters and include upper, lower, and numeric characters.',
    );
  }

  if (displayName.length > 120) {
    throw new Error('ADMIN_NAME must not exceed 120 characters.');
  }

  return { displayName, email, password };
}

async function createAdmin() {
  const input = readAdminInput();
  await dataSource.initialize();

  try {
    const users = dataSource.getRepository(User);
    const existing = await users.findOne({ where: { email: input.email } });

    if (existing && existing.role !== Role.ADMIN) {
      throw new Error(
        `The email ${input.email} already belongs to a ${existing.role.toLowerCase()} account. Choose another email.`,
      );
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    if (existing) {
      existing.displayName = input.displayName;
      existing.passwordHash = passwordHash;
      existing.refreshTokenHash = null;
      existing.blockedAt = null;
      existing.blockedReason = null;
      await users.save(existing);
      process.stdout.write(`Admin account ${input.email} was updated.\n`);
      return;
    }

    const admin = users.create({
      role: Role.ADMIN,
      email: input.email,
      passwordHash,
      displayName: input.displayName,
      parentId: null,
      refreshTokenHash: null,
    });
    await users.save(admin);
    process.stdout.write(`Admin account ${input.email} was created.\n`);
  } finally {
    await dataSource.destroy();
  }
}

void createAdmin().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : 'Could not create admin account.'}\n`,
  );
  process.exitCode = 1;
});
