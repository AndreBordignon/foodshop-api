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
  Req,
  Res,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import {
  UpdateRestaurantDto,
  UpdateRestaurantProductsDto,
} from './dto/update-restaurant.dto';
import { ApiTags } from '@nestjs/swagger';

import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Restaurant } from './entities/restaurant.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/mail/mail.service';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { UserService } from 'src/user/user.service';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly restaurantsService: RestaurantsService,
  ) {}

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
    console.log('aaa');
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

  @Patch(':id/products')
  update(
    @Param('id') id: string,
    @Body() updateRestaurantProductsDto: UpdateRestaurantProductsDto,
  ) {
    return this.restaurantsService.addProductToRestaurant(
      +id,
      updateRestaurantProductsDto.product,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(+id);
  }
}
