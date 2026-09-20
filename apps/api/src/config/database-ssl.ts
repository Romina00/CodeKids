import type { ConnectionOptions } from 'tls';

export function databaseSsl(
  env: NodeJS.ProcessEnv = process.env,
): ConnectionOptions | undefined {
  // Docker development and Aiven production use separate databases, not replicas.
  // Set DB_SSL=true for Aiven; local Docker keeps TLS disabled by default.
  if (env.DB_SSL !== 'true') {
    return undefined;
  }

  const ca = env.DB_SSL_CA?.replace(/\\n/g, '\n').trim();
  return {
    rejectUnauthorized: true,
    ...(ca ? { ca } : {}),
  };
}
