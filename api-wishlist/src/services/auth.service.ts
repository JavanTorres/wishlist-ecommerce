import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { users } from '../application/mocks/users.mock';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}


  async validateUser(username: string, password: string) {
    const user = users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
      return { uuid: user.uuid , username: user.username};
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, uuid: user.uuid };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }
}