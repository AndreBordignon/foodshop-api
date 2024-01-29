import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.statregy';
import { UserModule } from 'src/user/user.module';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'abc123',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
