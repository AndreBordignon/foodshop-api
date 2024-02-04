import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateStoreDto } from './create-store.dto';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/user/entities/user.entitie';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {
  name: string;
  managerName: string;
  managerEmail: string;
  companyPhone: string;
  isActive?: boolean;
  password: string;
  products?: Product[];
  manager?: User;
}

export class UpdateStoreProductsDto {
  @ApiProperty({ description: 'Product object' })
  product?: Product;
}
