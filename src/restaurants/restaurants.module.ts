import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entitie';
import { ProductsService } from 'src/products/products.service';
import { ProductsModule } from 'src/products/products.module';
import { Product } from 'src/products/entities/product.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant, User, Product]),
    UserModule,
    ProductsModule,
    AuthModule,
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService, UserService, ProductsService, MailService],
  exports: [TypeOrmModule, RestaurantsService],
})
export class RestaurantsModule {}
