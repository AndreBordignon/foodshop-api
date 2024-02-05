import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Barra Foods',
    description: 'Nome da categoria',
  })
  @Column()
  name: string;

  @ManyToMany(() => Product, (product) => product.categories)
  @JoinTable({
    name: 'category_products',
  })
  products: Product[];
}
