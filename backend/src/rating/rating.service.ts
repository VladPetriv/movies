import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { MoviesService } from '../movies/movies.service';
import { UsersService } from '../users/users.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { RecordIsExistError } from '../errors/RecordIsExistError';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    private readonly userService: UsersService,
    private readonly movieService: MoviesService,
  ) {}

  async getAllRatings(): Promise<Rating[]> {
    return await this.ratingRepository.find({
      relations: ['user', 'movie'],
    });
  }

  async getAllRatingsByMovie(movie_id: number): Promise<Rating[]> {
    const movie = await this.movieService.getOneMovie(movie_id);
    const rating = await this.ratingRepository.find({
      where: {
        movie,
      },
    });
    return rating;
  }

  async getAllRatingsByUser(user_email: string): Promise<Rating[]> {
    const user = await this.userService.getUserByEmail(user_email);
    const rating = await this.ratingRepository.find({
      where: {
        user,
      },
      relations: ['user', 'movie'],
    });
    return rating;
  }

  async getUserRatingByMovie(
    user_email: string,
    movie_id: number,
  ): Promise<Rating> {
    const user = await this.userService.getUserByEmail(user_email);
    const movie = await this.movieService.getOneMovie(movie_id);
    const rating = await this.ratingRepository.findOne({
      where: {
        user,
        movie,
      },
      relations: ['user', 'movie'],
    });
    return rating;
  }

  async createRating(dto: CreateRatingDto): Promise<Rating> {
    const user = await this.userService.getUserByEmail(dto.user_email);
    const movie = await this.movieService.getOneMovie(dto.movie_id);
    const candidate = await this.ratingRepository.findOne({
      where: {
        movie,
        user,
      },
    });
    if (candidate) throw new RecordIsExistError('Rating is exist');
    const rating = await this.ratingRepository.create({
      value: dto.value,
      movie,
      user,
    });
    await this.ratingRepository.save(rating);
    return rating;
  }
}
