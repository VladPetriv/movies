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
    const movie = await this.movieService.getOneMovie(Number(movie_id));
    if (!movie) {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    }
    return movie;
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
    const movie = await this.movieService.createMovie({
      ...createMovieDto,
      poster,
    });
    if (!movie) {
      throw new HttpException('Movie is exist', HttpStatus.NOT_FOUND);
    }
    return movie;
  }

  @ApiOperation({ summary: 'Delete movie' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('/:movie_id')
  async deleteMovie(@Param('movie_id') movie_id: string): Promise<string> {
    const movie = await this.movieService.deleteMovie(Number(movie_id));
    if (!movie) {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    }
    return movie;
  }
}
