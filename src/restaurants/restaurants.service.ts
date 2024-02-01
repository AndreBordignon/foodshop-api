import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import {
  UpdateRestaurantDto,
  UpdateRestaurantProductsDto,
} from './dto/update-restaurant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Product } from 'src/products/entities/product.entity';
import { UpdateProductDto } from 'src/products/dto/update-product.dto';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/mail/mail.service';

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
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private userService: UserService,
    private mailService: MailService,
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {}
  async create(createRestaurantDto: CreateRestaurantDto): Promise<any> {
    const user = await this.userService.findOne(
      createRestaurantDto.managerEmail,
    );

    const restaurant = await this.restaurantRepository.findOneBy({
      name: createRestaurantDto.name,
    });

    if (restaurant) {
      throw new HttpException('Restaurante já existe', 400);
    }
    if (!user) {
      const createManagerUserDto = {
        email: createRestaurantDto.managerEmail,
        firstName: createRestaurantDto.managerName,
        lastName: '',
        isActive: false,
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
        isActive: false,
        password: createRestaurantDto.password,
      };

      this.restaurantRepository.save(restaurant);
      const { access_token, user } = await this.authService.validateUser({
        username: createManagerUserDto.email,
        password: createManagerUserDto.password,
      });
      this.mailService.sendUserConfirmation(user, access_token);

      return { message: 'Você vai receber um e-mail' };
    }

    const newRestaurant = this.restaurantRepository.create(createRestaurantDto);
    newRestaurant.manager = user;

    await this.restaurantRepository.save(newRestaurant);

    return newRestaurant;
  }

  findAll() {
    return `This action returns all restaurants`;
  }

  async upload(fileName: string, file: Buffer) {
    const command = new PutObjectCommand({
      Bucket: 'foodshop-images',
      Key: fileName,
      Body: file,
    });
    try {
      await this.s3Client.send(command);
      // Construa a URL da imagem
      const imageUrl = `https://foodshop-images.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}`;
      return imageUrl;
    } catch (error) {
      console.error('Erro ao fazer upload para o S3:', error);
      throw new Error('Falha no upload do arquivo');
    }
  }

  findOne(id: number) {
    const restaurant = this.restaurantRepository.findOneBy({ id: id });

    return restaurant;
  }

  async addProductToRestaurant(
    restaurantId: number,
    updateProductDto: UpdateRestaurantProductsDto,
  ) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ['products'], // Carrega os produtos existentes relacionados ao restaurante
    });

    if (!restaurant) {
      throw new Error('Restaurante não encontrado');
    }

    let product = await this.productRepository.findOneBy({
      name: updateProductDto.name,
    });

    if (!product) {
      product = this.productRepository.create(updateProductDto);
      await this.productRepository.save(product);
    }

    const isProductAlreadyAdded = restaurant.products.some(
      (p) => p.id === product.id,
    );

    if (!isProductAlreadyAdded) {
      restaurant.products.push(product);
      await this.restaurantRepository.save(restaurant);

      return restaurant;
    }

    return restaurant;
  }

  remove(id: number) {
    return `This action removes a #${id} restaurant`;
  }
}
