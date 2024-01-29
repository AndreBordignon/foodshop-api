import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/client.entitie';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente])],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
