import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActorsService } from './actors.service';
import { ActorsController } from './actors.controller';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../files/files.module';
import { Actor } from './actor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Actor]), AuthModule, FilesModule],
  providers: [ActorsService],
  controllers: [ActorsController],
})
export class ActorsModule {}
