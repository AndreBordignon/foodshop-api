import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { MailService } from './mail/mail.service';
import { ConfigModule } from '@nestjs/config';
import { StoresController } from './stores/stores.controller';
import { StoresModule } from './stores/stores.module';
import { StoresService } from './stores/stores.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin123',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    StoresModule,
    UserModule,
    AuthModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    OrdersModule,
    ProductsModule,
    CategoriesModule,
  ],
  controllers: [
    AppController,
    UserController,
    StoresController,
    ProductsController,
  ],
  providers: [
    AppService,
    UserService,
    MailService,
    StoresService,
    ProductsService,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('user');
  }
}
