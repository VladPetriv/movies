import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { Rating } from './rating.entity';
import { MoviesModule } from '../movies/movies.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rating]),
    MoviesModule,
    UsersModule,
    AuthModule,
  ],
  providers: [RatingService],
  controllers: [RatingController],
})
export class RatingModule {}
