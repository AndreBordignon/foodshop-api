import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entitie';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Barra Foods',
    description: 'Nome da marca',
  })
  @Column()
  companyName: string;

  @Column()
  companyPhone: string;

  @ManyToOne(() => User, (user) => user.restaurants)
  @JoinColumn({ name: 'manager' })
  manager: User;

  @Column({ default: true })
  isActive: boolean;
}
