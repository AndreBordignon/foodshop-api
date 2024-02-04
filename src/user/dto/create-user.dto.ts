import { ApiProperty } from '@nestjs/swagger';
import { Store } from 'src/stores/entities/store.entity';

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

  @ApiProperty({ description: 'Store ID', required: false })
  stores?: Store[];
}
