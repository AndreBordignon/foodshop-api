import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/user/entities/user.entitie';

export class CreateRestaurantDto {
  id?: any;
  file?: any;
  name: string;
  managerName: string;
  managerEmail: string;
  companyPhone: string;
  isActive?: boolean;
  password: string;
  manager?: User;
  products?: Product[] = [];
}
