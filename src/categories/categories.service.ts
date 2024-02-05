import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });
    if (category) {
      return 'Category already exists';
    }
    createCategoryDto.name = createCategoryDto.name.toLowerCase().trim();
    const newCategory = this.categoryRepository.create(createCategoryDto);
    this.categoryRepository.save(newCategory);
    return newCategory;
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  remove(id: number) {
    this.categoryRepository.delete(id);

    return 'Categoria deletada';
  }
}
