import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto, UpdateStoreProductsDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Product } from 'src/products/entities/product.entity';
import { UpdateProductDto } from 'src/products/dto/update-product.dto';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class StoresService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID, //chave de acesso
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, //chave de acesso secreta
    },
  });
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private userService: UserService,
    private mailService: MailService,
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {}
  async create(createStoreDto: CreateStoreDto): Promise<any> {
    const user = await this.userService.findOne(createStoreDto.managerEmail);

    const store = await this.storeRepository.findOneBy({
      name: createStoreDto.name,
    });

    if (store) {
      throw new HttpException('Storee já existe', 400);
    }
    if (!user) {
      const createManagerUserDto = {
        email: createStoreDto.managerEmail,
        firstName: createStoreDto.managerName,
        lastName: '',
        isActive: false,
        password: createStoreDto.password,
        store: createStoreDto,
        manager: createStoreDto.managerEmail,
      };

      const createdUser = await this.userService.create(createManagerUserDto);

      const store = this.storeRepository.create(createStoreDto);
      store.manager = {
        id: createdUser.id,
        email: createStoreDto.managerEmail,
        firstName: createStoreDto.managerName,
        lastName: '',
        isActive: false,
        password: createStoreDto.password,
      };

      this.storeRepository.save(store);
      const { access_token, user } = await this.authService.validateUser({
        username: createManagerUserDto.email,
        password: createManagerUserDto.password,
      });
      this.mailService.sendUserConfirmation(user, access_token);

      return { message: 'Você vai receber um e-mail' };
    }

    const newStore = this.storeRepository.create(createStoreDto);
    newStore.manager = user;

    await this.storeRepository.save(newStore);

    return newStore;
  }

  findAll() {
    const stores = this.storeRepository.find();
    return stores;
  }

  async upload(fileName: string, file: Buffer) {
    const command = new PutObjectCommand({
      Bucket: 'foodshop-images',
      Key: fileName,
      Body: file,
    });
    try {
      await this.s3Client.send(command);
      // Construa a URL da imagem
      const imageUrl = `https://foodshop-images.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}`;
      return imageUrl;
    } catch (error) {
      console.error('Erro ao fazer upload para o S3:', error);
      throw new Error('Falha no upload do arquivo');
    }
  }

  async findOne(id: number) {
    const store = await this.storeRepository.findOne({
      where: { id: id },
      relations: ['products'],
    });

    return store;
  }

  async addProductToStore(
    storeId: number,
    updateProductDto: UpdateStoreProductsDto,
  ) {
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
      relations: ['products'], // Carrega os produtos existentes relacionados ao storee
    });

    if (!store) {
      throw new Error('Storee não encontrado');
    }

    let product = await this.productRepository.findOneBy({
      name: updateProductDto.product.name,
    });

    if (!product) {
      product = this.productRepository.create(updateProductDto.product);
      await this.productRepository.save(product);
    }

    const isProductAlreadyAdded = store.products.some(
      (p) => p.id === product.id,
    );

    if (!isProductAlreadyAdded) {
      store.products.push(product);
      await this.storeRepository.save(store);

      return store;
    }

    return store;
  }

  remove(id: number) {
    this.storeRepository.delete({ id: id });

    return `This action removes ${id} store`;
  }
}
