import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Store } from 'src/stores/entities/store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { findAllProductsRequestDto } from './dto/get-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const store = await this.storeRepository.findOneBy({
      id: createProductDto.storeId,
    });

    let product = await this.productRepository.findOne({
      where: { name: createProductDto.product.name },
      relations: ['stores'], // Carrega os storees existentes relacionados ao produto
    });

    if (product) {
      // O produto já existe, então adicionamos o novo storee à lista de storees do produto
      if (!product.stores.some((r) => r.id === store.id)) {
        product.stores.push(store); // Adiciona o novo storee à lista
      }
      // Salva as atualizações do produto
      await this.productRepository.save(product);
    } else {
      // Cria um novo produto se ele não existir
      product = this.productRepository.create({
        ...createProductDto.product,
        stores: [store], // Associa o novo storee ao novo produto
      });
      // Salva o novo produto
      await this.productRepository.save(product);
    }
  }

  findAll(storeId: number) {
    return this.productRepository.find({
      where: { stores: { id: storeId } }, // Filtra produtos pela loja especificada
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  async addProductToStore(
    productId: number,
    updateProductDto: UpdateProductDto,
  ) {
    const product = this.productRepository.findOneBy({ id: productId });

    return `This action updates a #${product} product`;
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({
      where: { id: id },
      relations: ['stores'],
    });

    if (!product) {
      throw new Error('Produto não encontrado');
    }

    // Remove relations from (store_products table)
    product.stores = [];
    await this.productRepository.save(product);

    await this.productRepository.remove(product);
    return `This action removes a #${id} product`;
  }
}
