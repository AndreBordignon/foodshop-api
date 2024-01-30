import { Restaurant } from 'src/restaurants/entities/restaurant.entity';

export class User {
  id: number;

  firstName: string;

  lastName: string;

  isActive: boolean;

  email: string;

  password: string;

  restaurtants?: Restaurant[];
}
