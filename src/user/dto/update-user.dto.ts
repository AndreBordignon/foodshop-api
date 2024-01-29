import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { User } from '../entities/user.entitie';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  data?: User;
}
