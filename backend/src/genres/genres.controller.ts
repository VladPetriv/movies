import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleGuard } from '../auth/roles.guard';
import { CreateGenreDto } from './dto/create-genre.dto';
import { Genre } from './genre.entity';
import { GenresService } from './genres.service';
import { NotFoundError } from '../errors/NotFoundError';
import { RecordIsExistError } from '../errors/RecordIsExistError';

@ApiTags('Genre controller')
@Controller('genres')
export class GenresController {
  constructor(private readonly genreService: GenresService) {}

  @ApiOperation({ summary: 'Get all genres' })
  @ApiResponse({ status: 200, type: [Genre] })
  @Get('')
  async getAllGenres(): Promise<Genre[]> {
    return await this.genreService.getAll();
  }

  @ApiOperation({ summary: 'Get one genre by id' })
  @ApiResponse({ status: 200, type: Genre })
  @Get('/:genre_id')
  async getOneGenre(@Param('genre_id') genre_id: string): Promise<Genre> {
    try {
      const genre = await this.genreService.getOne(Number(genre_id));
      return genre;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      }
    }
  }

  @ApiOperation({ summary: 'Create new genre' })
  @ApiResponse({ status: 201, type: Genre })
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @Post('/create')
  async createGenre(@Body() createGenreDto: CreateGenreDto): Promise<Genre> {
    try {
      const genre = await this.genreService.create(createGenreDto);
      return genre;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      } else if (err instanceof RecordIsExistError) {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @ApiOperation({ summary: 'Delete genre' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('/:genre_id')
  async deleteGenre(@Param('genre_id') genre_id: string): Promise<string> {
    try {
      const genre = await this.genreService.delete(Number(genre_id));
      return genre;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      }
    }
  }
}
