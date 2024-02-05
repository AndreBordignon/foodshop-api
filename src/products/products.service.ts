import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Store } from 'src/stores/entities/store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { findAllProductsRequestDto } from './dto/get-product.dto';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const store = await this.findStoreById(createProductDto.storeId);
    const category = await this.findOrCreateCategory(
      createProductDto.product?.category,
    );
    const product = await this.findOrCreateProduct(
      createProductDto.product,
      store,
      category,
    );

    return product;
  }

  private async findStoreById(storeId: number): Promise<Store> {
    const store = await this.storeRepository.findOneBy({ id: storeId });
    if (!store) {
      throw new Error('Loja não encontrada');
    }
    return store;
  }

  private async findOrCreateCategory(categoryName: string): Promise<Category> {
    let category = await this.categoryRepository.findOneBy({
      name: categoryName,
    });
    if (!category) {
      category = this.categoryRepository.create({ name: categoryName });
      await this.categoryRepository.save(category);
    }
    return category;
  }

  private async findOrCreateProduct(
    productDto: Product,
    store: Store,
    category: Category,
  ): Promise<Product> {
    let product = await this.productRepository.findOne({
      where: { name: productDto.name },
      relations: ['stores', 'categories'],
    });

    if (product) {
      this.updateProductRelations(product, store, category);
    } else {
      product = this.productRepository.create({
        ...productDto,
        stores: [store],
        categories: [category],
      });
    }
    await this.productRepository.save(product);
    return product;
  }

  private updateProductRelations(
    product: Product,
    store: Store,
    category: Category,
  ) {
    const isNewStore = !product.stores.some(
      (storeItem) => storeItem.id === store.id,
    );
    const isNewCategory = !product.categories.some(
      (categoryItem) => categoryItem.id === category.id,
    );

    if (isNewStore) {
      product.stores.push(store);
    }
    if (isNewCategory) {
      product.categories.push(category);
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
