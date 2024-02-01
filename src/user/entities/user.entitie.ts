import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: false })
  isActive: boolean;

  @Column()
  email: string;

  @OneToMany(() => Restaurant, (restaurant) => restaurant.manager)
  restaurants?: Restaurant[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'created_at',
  })
  createdAt?: Date;

  @Column({ nullable: false })
  password: string;
}
