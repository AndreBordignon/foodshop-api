import { ApiProperty } from '@nestjs/swagger';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/user/entities/user.entitie';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Barra Foods',
    description: 'Nome da marca',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: 'O melhor hamburguer da cidade',
    description: 'descrição da marca',
  })
  @Column()
  description: string;

  @ManyToMany(() => Restaurant, (restaurant) => restaurant.products, {
    cascade: true,
  })
  restaurants: Restaurant[];

  @ApiProperty({
    example:
      'https://foodshop-images.s3.sa-east-1.amazonaws.com/logo-restaurante-1.jpeg',
    description: 'Nome da marca',
  })
  @Column({ nullable: true })
  image_url: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({ default: true })
  isActive: boolean;
}
