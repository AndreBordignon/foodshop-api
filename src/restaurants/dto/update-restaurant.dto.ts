import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/user/entities/user.entitie';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  name: string;
  managerName: string;
  managerEmail: string;
  companyPhone: string;
  isActive?: boolean;
  password: string;
  products?: Product[];
  manager?: User;
}

export class UpdateRestaurantProductsDto {
  @ApiProperty({ description: 'Product object' })
  product?: Product;
}
