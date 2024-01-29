import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  hrAbertura: string;

  @Column()
  hrFechamento: string;
}
