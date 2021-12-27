import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { Movie } from './movie.entity';
import { Roles } from '../auth/roles.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../auth/roles.guard';
import { CreateMovieDto } from './dto/create-movie.dto';
import { AuthModule } from '../auth/auth.module';

@ApiTags('Movie controller')
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
  getOneMovie(@Param('movie_id') movie_id: string): Promise<Movie> {
    return this.movieService.getOneMovie(Number(movie_id));
  }

  @ApiOperation({ summary: 'Create new movie' })
  @ApiResponse({ status: 201, type: Movie })
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @Post('/create')
  createMovie(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.createMovie(createMovieDto);
  }

  @ApiOperation({ summary: 'Delete movie' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(AuthModule, RoleGuard)
  @Delete('/:movie_id')
  deleteMovie(@Param('movie_id') movie_id: string): Promise<string> {
    return this.movieService.deleteMovie(Number(movie_id));
  }
}
