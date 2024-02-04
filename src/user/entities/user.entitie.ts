import { Store } from 'src/stores/entities/store.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
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

  @OneToMany(() => Store, (store) => store.manager)
  stores?: Store[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'created_at',
  })
  createdAt?: Date;

  @Column({ nullable: false })
  password: string;
}
