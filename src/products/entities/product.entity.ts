import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/categories/entities/category.entity';
import { Store } from 'src/stores/entities/store.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
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

  @ManyToMany(() => Category, (category) => category.products)
  categories: Category[];

  @ManyToMany(() => Store, (store) => store.products, {
    cascade: true,
  })
  stores: Store[];

  @Column({ name: 'price_in_cents' })
  priceInCents: number;

  @ApiProperty({
    example:
      'https://foodshop-images.s3.sa-east-1.amazonaws.com/logo-storee-1.jpeg',
    description: 'url da logo',
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
