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
export class Store {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: '2',
    description: 'ID do store',
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

  @ManyToOne(() => User, (user) => user.stores)
  @JoinColumn({ name: 'manager' })
  manager: User;

  @ManyToMany(() => Product, (product) => product.stores)
  @JoinTable({ name: 'store_products' })
  products: Product[];

  @ApiProperty({
    example: 'https://localstore-s3.com/image.png',
    description: 'upload de file',
  })
  @Column({ nullable: true })
  image_url: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'created_at',
  })
  createdAt: Date;

  @ApiProperty({
    example: 'boolean',
    description: 'upload de file',
  })
  @Column({ default: true })
  isActive: boolean;
}
