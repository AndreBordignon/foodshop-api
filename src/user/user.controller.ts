import { Body, Controller, Post, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Get()
  async getUserInfo(@Req() req) {
    console.log(req.cookie);
    const tokenDecode = await this.jwtService.verifyAsync(
      req.cookies.access_token,
    );
    const user = await this.userService.findOne(tokenDecode.email);
    console.log(user);
    return user;
  }
}
