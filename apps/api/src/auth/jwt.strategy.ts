import { Injectable } from '@nestjs/common';
import { AuthenticatedUser } from './auth.types';

@Injectable()
export class JwtStrategy {
  validate(payload: AuthenticatedUser) {
    return payload;
  }
}
