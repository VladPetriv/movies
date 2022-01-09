import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { FilesService } from '../files/files.service';
import { GenresService } from '../genres/genres.service';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly fileService: FilesService,
    private readonly genreService: GenresService,
  ) {}

  async getAllMovies(): Promise<Movie[]> {
    return await this.movieRepository.find({
      relations: ['actors', 'genre'],
    });
  }
  async getOneMovie(movie_id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne(movie_id, {
      relations: ['actors', 'genre'],
    });
    if (!movie) return null;
    return movie;
  }
  async createMovie(dto: CreateMovieDto) {
    const candidate = await this.movieRepository.findOne({
      where: { title: dto.title },
    });
    if (candidate) return null;
    const genre = await this.genreService.getOneByName(dto.genre_name);
    const poster = await this.fileService.createFile(dto.poster);
    const movie = await this.movieRepository.create({ ...dto, poster, genre });
    await this.movieRepository.save(movie);
    return movie;
  }

  async deleteMovie(movie_id: number): Promise<string> {
    const movie = await this.movieRepository.findOne(movie_id);
    if (!movie) return null;
    await this.movieRepository.delete({ id: movie.id });
    return 'Movie was deleted';
  }
}
