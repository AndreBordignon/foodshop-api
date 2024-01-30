import { PartialType } from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  companyName: string;
  managerName: string;
  managerEmail: string;
  companyPhone: string;
  isActive?: boolean;
  password: string;
}
