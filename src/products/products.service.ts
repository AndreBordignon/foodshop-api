import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const restaurant = await this.restaurantRepository.findOneBy({
      id: createProductDto.restaurantId,
    });

    let product = await this.productRepository.findOne({
      where: { name: createProductDto.product.name },
      relations: ['restaurants'], // Carrega os restaurantes existentes relacionados ao produto
    });

    if (product) {
      // O produto já existe, então adicionamos o novo restaurante à lista de restaurantes do produto
      if (!product.restaurants.some((r) => r.id === restaurant.id)) {
        product.restaurants.push(restaurant); // Adiciona o novo restaurante à lista
      }
      // Salva as atualizações do produto
      await this.productRepository.save(product);
    } else {
      // Cria um novo produto se ele não existir
      product = this.productRepository.create({
        ...createProductDto.product,
        restaurants: [restaurant], // Associa o novo restaurante ao novo produto
      });
      // Salva o novo produto
      await this.productRepository.save(product);
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  async addProductToRestaurant(
    productId: number,
    updateProductDto: UpdateProductDto,
  ) {
    console.log(productId, updateProductDto);
    const girar = this.productRepository.findOneBy({ id: productId });
    console.log('girar', girar);
    return `This action updates a #${girar} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
