import { Product } from '../entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Product object' })
  product: Product;

  @ApiProperty({ description: 'restaurant id' })
  storeId: number;
}
