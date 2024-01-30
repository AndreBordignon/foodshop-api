import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
  managerName: string;

  @Column()
  managerEmail: string;

  @Column()
  companyPhone: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: false })
  password: string;
}
