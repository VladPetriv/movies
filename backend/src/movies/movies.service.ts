import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async getAllMovies(): Promise<Movie[]> {
    return await this.movieRepository.find();
  }
  async getOneMovie(movie_id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne(movie_id);
    if (!movie) {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    }
    return movie;
  }
  async createMovie(dto: CreateMovieDto) {
    const candidate = await this.movieRepository.findOne({
      where: { title: dto.title },
    });
    if (candidate) {
      throw new HttpException('Movie is exist', HttpStatus.BAD_REQUEST);
    }
    const movie = await this.movieRepository.create(dto);
    await this.movieRepository.save(movie);
    return movie;
  }

  async deleteMovie(movie_id: number): Promise<string> {
    const movie = await this.movieRepository.findOne(movie_id);
    if (!movie) {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    }
    await this.movieRepository.delete({ id: movie.id });
    return 'Movie was deleted';
  }
}
