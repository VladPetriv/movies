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
import { RecordIsExistError } from '../errors/RecordIsExistError';
import { NotFoundError } from '../errors/NotFoundError';

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
    try {
      const ratings = await this.ratingService.getAllRatingsByMovie(
        Number(movie_id),
      );
      return ratings;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      }
    }
  }
  @Get('/user/:user_email')
  @UseGuards(AuthGuard)
  async getAllByUser(
    @Param('user_email') user_email: string,
  ): Promise<Rating[]> {
    try {
      const ratings = await this.ratingService.getAllRatingsByUser(user_email);
      return ratings;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      }
    }
  }

  @Get('/:user_email/:movie_id')
  @UseGuards(AuthGuard)
  async getUserRatingByMovie(
    @Param('user_email') user_email: string,
    @Param('movie_id') movie_id: string,
  ): Promise<Rating> {
    try {
      const rating = await this.ratingService.getUserRatingByMovie(
        user_email,
        Number(movie_id),
      );
      return rating;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      }
    }
  }
  @Post('/create')
  @UseGuards(AuthGuard)
  async createRating(
    @Body() createRatingDto: CreateRatingDto,
  ): Promise<Rating> {
    try {
      const rating = await this.ratingService.createRating(createRatingDto);
      return rating;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      } else if (err instanceof RecordIsExistError) {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
