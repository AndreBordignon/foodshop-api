import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entitie';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
  async findOne(email: string): Promise<any> {
    const users = await this.usersRepository.findOne({
      where: { email: email },
      relations: ['stores'],
    });

    if (!users) {
      return null;
    }
    return users;
  }

  updateUser(updateUserData: any): Promise<any> {
    this.usersRepository.update(
      { id: updateUserData.id },
      {
        isActive: true,
      },
    );

    return { ...updateUserData, isActive: true };
  }

  create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);

    return this.usersRepository.save(user);
  }
}
