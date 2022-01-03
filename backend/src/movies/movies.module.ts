import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Movie } from './movie.entity';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../files/files.module';
import { GenresModule } from '../genres/genres.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie]),
    AuthModule,
    FilesModule,
    GenresModule,
  ],
  providers: [MoviesService],
  controllers: [MoviesController],
  exports: [MoviesService],
})
export class MoviesModule {}
