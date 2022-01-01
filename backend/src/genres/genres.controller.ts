import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleGuard } from '../auth/roles.guard';
import { CreateGenreDto } from './dto/create-genre.dto';
import { Genre } from './genre.entity';
import { GenresService } from './genres.service';

@ApiTags('Genre controller')
@Controller('genres')
export class GenresController {
  constructor(private readonly genreService: GenresService) {}

  @ApiOperation({ summary: 'Get all genres' })
  @ApiResponse({ status: 200, type: [Genre] })
  @Get('')
  getAllGenres(): Promise<Genre[]> {
    return this.genreService.getAll();
  }

  @ApiOperation({ summary: 'Get one genre by id' })
  @ApiResponse({ status: 200, type: Genre })
  @Get('/:genre_id')
  getOneGenre(@Param('genre_id') genre_id: string): Promise<Genre> {
    return this.genreService.getOne(Number(genre_id));
  }

  @ApiOperation({ summary: 'Create new genre' })
  @ApiResponse({ status: 201, type: Genre })
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @Post('/create')
  createGenre(@Body() createGenreDto: CreateGenreDto): Promise<Genre> {
    return this.genreService.create(createGenreDto);
  }

  @ApiOperation({ summary: 'Delete genre' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('/:genre_id')
  deleteActor(@Param('genre_id') genre_id: string): Promise<string> {
    return this.genreService.delete(Number(genre_id));
  }
}
