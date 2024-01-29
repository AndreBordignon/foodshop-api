import { Injectable } from '@nestjs/common';
import { AuthUserDto } from './dto/auth.user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  async generateConfirmationToken(payload: any): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
  async validateUser({ username, password }: AuthUserDto) {
    const userLogin = await this.userService.findOne(username);
    if (!userLogin) return null;
    if (password === userLogin?.password) {
      const { ...user } = userLogin;
      return {
        access_token: this.jwtService.sign(user),
        user,
      };
    }
  }
}
