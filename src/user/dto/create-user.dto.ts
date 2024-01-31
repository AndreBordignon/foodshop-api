import { ApiProperty } from '@nestjs/swagger';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';

export class CreateUserDto {
  @ApiProperty({ description: 'User first name' })
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  lastName: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User is active', required: false })
  isActive: boolean;

  @ApiProperty({ description: 'User password', required: true })
  password: string;

  @ApiProperty({ description: 'Restaurant ID', required: false })
  restaurants?: Restaurant[];
}
