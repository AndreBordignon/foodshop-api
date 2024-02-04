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
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreProductsDto } from './dto/update-store.dto';
import { ApiTags } from '@nestjs/swagger';

import { AnyFilesInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('Stores')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @UploadedFiles()
    file: Array<Express.Multer.File>,
    @Body() createStoreDto: CreateStoreDto,
  ) {
    const image = await this.storesService.upload(
      file[0].originalname,
      file[0].buffer,
    );

    const newStoreData = { ...createStoreDto, image_url: image };

    const store = await this.storesService.create(newStoreData);

    return store;
  }

  @Get()
  findAll() {
    return this.storesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/products')
  update(
    @Param('id') id: string,
    @Body() updateStoreProductsDto: UpdateStoreProductsDto,
  ) {
    return this.storesService.addProductToStore(+id, updateStoreProductsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storesService.remove(+id);
  }
}
