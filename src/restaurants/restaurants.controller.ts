import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseFilePipe,
  Put,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private userService: UserService,
  ) {}

  @Put()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [],
      }),
    )
    file: Express.Multer.File,
    @Body() createRestaurantDto: CreateRestaurantDto,
  ) {
    console.log(file);
    await this.restaurantsService.upload(file.originalname, file.buffer);
    const restaurant =
      await this.restaurantsService.create(createRestaurantDto);

    return restaurant;
  }

  @Get()
  findAll() {
    return this.restaurantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(+id, updateRestaurantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(+id);
  }
}
