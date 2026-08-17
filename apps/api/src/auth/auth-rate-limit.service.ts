import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
@Injectable()
export class AuthRateLimitService {
  private readonly attempts = new Map<string, number[]>();
  check(
    scope: string,
    clientKey: string,
    limit = 10,
    windowMs = 15 * 60 * 1000,
  ) {
    const key = `${scope}:${clientKey}`,
      now = Date.now();
    const recent = (this.attempts.get(key) ?? []).filter(
      (time) => time > now - windowMs,
    );
    if (recent.length >= limit)
      throw new HttpException(
        'Too many authentication attempts. Try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    recent.push(now);
    this.attempts.set(key, recent);
  }
}
