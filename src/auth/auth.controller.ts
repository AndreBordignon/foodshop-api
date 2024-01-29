import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiParam } from '@nestjs/swagger';
import { AuthUserDto } from './dto/auth.user.dto';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  @UseGuards(LocalGuard)
  @ApiBody({ type: AuthUserDto })
  async login(@Req() req: any) {
    if (!req.user.user.isActive) {
      const confirmation = await this.authService.generateConfirmationToken(
        req.user.user,
      );
      this.mailService.sendUserConfirmation(req.user.user, confirmation);
    }

    return req.user;
  }

  @Get('confirm')
  async confirmEmail(@Req() req: Request) {
    const { token } = req.query;
    if (token) {
      const isUserVerified = await this.jwtService.verifyAsync(String(token));

      if (isUserVerified) {
        const updatedUser = this.userService.updateUser(isUserVerified);

        return updatedUser;
      }
      return isUserVerified;
    }
    return req.user;
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  status(@Req() req: Request) {
    console.log('Inside AuthController status method');
    return req.user;
  }
}
