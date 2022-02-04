import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { Movie } from './movie.entity';
import { Roles } from '../auth/roles.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../auth/roles.guard';
import { CreateMovieDto } from './dto/create-movie.dto';
import { NotFoundError } from '../errors/NotFoundError';
import { RecordIsExistError } from '../errors/RecordIsExistError';

@ApiTags('Movie controller')
@UsePipes(new ValidationPipe())
@Controller('movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}
  @ApiOperation({ summary: 'Get all movie' })
  @ApiResponse({ status: 200, type: [Movie] })
  @Get('')
  getAllMovies(): Promise<Movie[]> {
    return this.movieService.getAllMovies();
  }

  @ApiOperation({ summary: 'Get one movie by id' })
  @ApiResponse({ status: 200, type: Movie })
  @Get('/:movie_id')
  async getOneMovie(@Param('movie_id') movie_id: string): Promise<Movie> {
    try {
      const movie = await this.movieService.getOneMovie(Number(movie_id));
      return movie;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      }
    }
  }

  @ApiOperation({ summary: 'Create new movie' })
  @ApiResponse({ status: 201, type: Movie })
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('poster'))
  @Post('/create')
  async createMovie(
    @Body() createMovieDto: CreateMovieDto,
    @UploadedFile() poster: string,
  ): Promise<Movie> {
    try {
      const movie = await this.movieService.createMovie({
        ...createMovieDto,
        poster,
      });
      return movie;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      } else if (err instanceof RecordIsExistError) {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @ApiOperation({ summary: 'Delete movie' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('/:movie_id')
  async deleteMovie(@Param('movie_id') movie_id: string): Promise<string> {
    try {
      const movie = await this.movieService.deleteMovie(Number(movie_id));
      return movie;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      }
    }
  }
}
