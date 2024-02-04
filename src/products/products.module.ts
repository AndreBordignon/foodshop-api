import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/stores/entities/store.entity';
import { User } from 'src/user/entities/user.entitie';
import { Product } from './entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, User, Product, Category])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
