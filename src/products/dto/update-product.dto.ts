import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { Store } from 'src/stores/entities/store.entity';
import { Product } from '../entities/product.entity';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ description: 'Product object' })
  product: Product;

  @ApiProperty({ description: 'store id' })
  stores: Store[];
}
