import { Store } from 'src/stores/entities/store.entity';

export class User {
  id: number;

  firstName: string;

  lastName: string;

  isActive: boolean;

  email: string;

  password: string;

  restaurtants?: Store[];
}
