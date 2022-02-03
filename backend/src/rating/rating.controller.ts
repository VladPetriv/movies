import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Rating } from './rating.entity';
import { RatingService } from './rating.service';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Rating controller')
@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get()
  async getAll(): Promise<Rating[]> {
    return await this.ratingService.getAllRatings();
  }

  @Get('/movie/:movie_id')
  @UseGuards(AuthGuard)
  async getAllByMovie(@Param('movie_id') movie_id: string): Promise<Rating[]> {
    const ratings = await this.ratingService.getAllRatingsByMovie(
      Number(movie_id),
    );
    if (!ratings) {
      throw new HttpException(
        'Movie or Ratings not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return ratings;
  }
  @Get('/user/:user_email')
  @UseGuards(AuthGuard)
  async getAllByUser(
    @Param('user_email') user_email: string,
  ): Promise<Rating[]> {
    const ratings = await this.ratingService.getAllRatingsByUser(user_email);
    if (!ratings) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return ratings;
  }

  @Get('/:user_email/:movie_id')
  @UseGuards(AuthGuard)
  async getUserRatingByMovie(
    @Param('user_email') user_email: string,
    @Param('movie_id') movie_id: string,
  ): Promise<Rating> {
    const rating = await this.ratingService.getUserRatingByMovie(
      user_email,
      Number(movie_id),
    );
    if (!rating) {
      throw new HttpException(
        'User,movie or rating not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return rating;
  }
  @Post('/create')
  @UseGuards(AuthGuard)
  async createRating(
    @Body() createRatingDto: CreateRatingDto,
  ): Promise<Rating> {
    const rating = await this.ratingService.createRating(createRatingDto);
    if (!rating) {
      throw new HttpException('User or movie not found', HttpStatus.NOT_FOUND);
    }
    return rating;
  }
}
