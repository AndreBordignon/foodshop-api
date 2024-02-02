import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { Product } from '../entities/product.entity';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ description: 'Product object' })
  product: Product;

  @ApiProperty({ description: 'restaurant id' })
  restaurants: Restaurant[];
}
