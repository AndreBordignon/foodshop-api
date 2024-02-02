import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantProductsDto } from './dto/update-restaurant.dto';
import { ApiTags } from '@nestjs/swagger';

import { AnyFilesInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @UploadedFiles()
    file: Array<Express.Multer.File>,
    @Body() createRestaurantDto: CreateRestaurantDto,
  ) {
    const image = await this.restaurantsService.upload(
      file[0].originalname,
      file[0].buffer,
    );

    const newRestaurantData = { ...createRestaurantDto, image_url: image };

    const restaurant = await this.restaurantsService.create(newRestaurantData);

    return restaurant;
  }

  @Get()
  findAll() {
    return this.restaurantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/products')
  update(
    @Param('id') id: string,
    @Body() updateRestaurantProductsDto: UpdateRestaurantProductsDto,
  ) {
    return this.restaurantsService.addProductToRestaurant(
      +id,
      updateRestaurantProductsDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(+id);
  }
}
