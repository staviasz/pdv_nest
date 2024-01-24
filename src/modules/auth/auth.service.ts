import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
dotenv.config();

interface JwtPayload {
  id: number;
  name: string;
  email: string;
}
@Injectable()
export class AuthService {
  private readonly accessKey = process.env.JWT_ACCESS_KEY;
  generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.accessKey, { expiresIn: '1d' });
  }

  verifyToken(token: string) {
    return jwt.verify(token, this.accessKey) as JwtPayload;
  }
}
