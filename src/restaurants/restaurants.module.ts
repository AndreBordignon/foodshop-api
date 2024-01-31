import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entitie';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, User]), UserModule],
  controllers: [RestaurantsController],
  providers: [RestaurantsService, UserService],
  exports: [TypeOrmModule, RestaurantsService],
})
export class RestaurantsModule {}
