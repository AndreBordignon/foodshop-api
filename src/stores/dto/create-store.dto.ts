import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/user/entities/user.entitie';

export class CreateStoreDto {
  @ApiProperty({ description: 'Store ID', required: false })
  id?: any;
  @ApiProperty({ description: 'Store logo', required: false })
  file?: any;

  @ApiProperty({ description: 'Store name', required: true })
  name: string;

  @ApiProperty({ description: 'Manager name', required: true })
  managerName: string;
  @ApiProperty({ description: 'manager email', required: true })
  managerEmail: string;

  @ApiProperty({ description: 'phone' })
  companyPhone: string;

  @ApiProperty({ description: 'is register active' })
  isActive?: boolean;

  @ApiProperty({ description: 'is register active', required: true })
  password: string;

  manager?: User;

  @ApiProperty({ description: 'products from the store', required: false })
  products?: Product[] = [];
}
