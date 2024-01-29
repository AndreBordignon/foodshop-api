import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({ description: 'User object inside the object' })
  username: string;
  @ApiProperty({ description: 'User object inside the object' })
  password: string;
}
