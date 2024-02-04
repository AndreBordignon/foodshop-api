import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
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
    TypeOrmModule.forFeature([Store, User, Product]),
    UserModule,
    ProductsModule,
    AuthModule,
  ],
  controllers: [StoresController],
  providers: [StoresService, UserService, ProductsService, MailService],
  exports: [TypeOrmModule, StoresService],
})
export class StoresModule {}
