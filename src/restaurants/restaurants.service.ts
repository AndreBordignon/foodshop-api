import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class RestaurantsService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID, //chave de acesso
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, //chave de acesso secreta
    },
  });
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    private userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  async create(createRestaurantDto: CreateRestaurantDto): Promise<any> {
    const user = await this.userService.findOne(
      createRestaurantDto.managerEmail,
    );

    const restaurant = await this.restaurantRepository.findOneBy({
      companyName: createRestaurantDto.companyName,
    });

    if (restaurant) {
      console.log(restaurant);
      throw new HttpException('Restaurante já existe', 400);
    }
    if (!user) {
      const createManagerUserDto = {
        email: createRestaurantDto.managerEmail,
        firstName: createRestaurantDto.managerName,
        lastName: '',
        isActive: true,
        password: createRestaurantDto.password,
        restaurant: createRestaurantDto,
        manager: createRestaurantDto.managerEmail,
      };

      const createdUser = await this.userService.create(createManagerUserDto);

      const restaurant = this.restaurantRepository.create(createRestaurantDto);

      restaurant.manager = {
        id: createdUser.id,
        email: createRestaurantDto.managerEmail,
        firstName: createRestaurantDto.managerName,
        lastName: '',
        isActive: true,
        password: createRestaurantDto.password,
      };
      this.restaurantRepository.save(restaurant);

      return restaurant;
    }

    const newRestaurant = this.restaurantRepository.create(createRestaurantDto);
    newRestaurant.manager = user;
    this.restaurantRepository.save(newRestaurant);

    return restaurant;
  }

  findAll() {
    return `This action returns all restaurants`;
  }

  async upload(fileName: string, file: Buffer) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'foodshop-images',
        Key: fileName,
        Body: file,
      }),
    );
  }
  findOne(id: number) {
    return `This action returns a #${id} restaurant`;
  }

  update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    return `This action updates a #${id} restaurant`;
  }

  remove(id: number) {
    return `This action removes a #${id} restaurant`;
  }
}
