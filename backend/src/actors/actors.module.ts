import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActorsService } from './actors.service';
import { ActorsController } from './actors.controller';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../files/files.module';
import { Actor } from './actor.entity';
import { MoviesModule } from 'src/movies/movies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Actor]),
    AuthModule,
    FilesModule,
    MoviesModule,
  ],
  providers: [ActorsService],
  controllers: [ActorsController],
})
export class ActorsModule {}
