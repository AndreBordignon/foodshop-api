import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private userService: UserService,
  ) {}

  @Post()
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    const createManagerUser = {
      email: createRestaurantDto.managerEmail,
      firstName: createRestaurantDto.managerName,
      lastName: '',
      isActive: true,
      password: createRestaurantDto.password,
    };
    const userExists = this.userService.findOne(createManagerUser.email);
    let newUser = {};
    if (!userExists) {
      newUser = this.userService.create(createManagerUser);
    }

    return this.restaurantsService.create(createRestaurantDto), newUser;
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
