import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.usersService.getUserByEmail(email);

    if (!(user && (await bcrypt.compare(password, user.password)))) {
      throw new UnauthorizedException('invalid credentials');
    }

    const payload = { id: user.id, username: user.email };
    console.log('payload', payload);
    const token = await this.jwtService.signAsync(payload);
    const decodedToken = this.jwtService.decode(token);
    console.log(decodedToken);
    return {
      access_token: token,
    };
  }
}
