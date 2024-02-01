import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
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
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res,
  ): Promise<any> {
    const userRequest = req.body;
    const { access_token, user } =
      await this.authService.validateUser(userRequest);

    if (user.isActive) {
      res
        .cookie('access_token', access_token, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
        })
        .send({ status: 'ok' });
      return;
    }

    this.mailService.sendUserConfirmation(user, access_token);
    return { message: 'Você vai receber um e-mail' };
  }

  @Get('confirm')
  async confirmEmail(@Req() req: Request, @Res() res) {
    const { token } = req.query;
    if (token) {
      const isUserVerified = await this.jwtService.verifyAsync(String(token));
      if (!isUserVerified.isActive) {
        const updatedUser = await this.userService.updateUser(isUserVerified);
        res
          .cookie('access_token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
          })
          .send({ status: 'ok' });
        return updatedUser;
      }
    }
    return req;
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  getProfile(@Req() req, @Res() res) {
    return res.send({ status: 'Autorizado' }, 200);
  }

  @Post('signout')
  signOut(@Res() response) {
    // Define o cookie de autenticação para expirar imediatamente
    response.cookie('access_token', '', {
      httpOnly: true, // Recomendado para prevenir ataques XSS
      expires: new Date(0), // Define a data de expiração para o passado, forçando o navegador a descartar o cookie
    });

    // Pode retornar uma resposta indicando que o logout foi bem-sucedido
    return response.status(200).send('Logout successful');
  }
}
