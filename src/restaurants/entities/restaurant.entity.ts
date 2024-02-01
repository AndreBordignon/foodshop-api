import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/products/entities/product.entity';
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
  JoinTable,
} from 'typeorm';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: '2',
    description: 'ID do restaurante',
  })
  id: number;

  @ApiProperty({
    example: 'Barra Foods',
    description: 'Nome da marca',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: '45998253744',
    description: 'Nome da marca',
  })
  @Column()
  phone: string;

  @ManyToOne(() => User, (user) => user.restaurants)
  @JoinColumn({ name: 'manager' })
  manager: User;

  @ManyToMany(() => Product, (product) => product.restaurants)
  @JoinTable({ name: 'restaurant_products' })
  products: Product[];

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
