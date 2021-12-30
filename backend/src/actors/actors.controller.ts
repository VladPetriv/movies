import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleGuard } from '../auth/roles.guard';
import { Actor } from './actor.entity';
import { ActorsService } from './actors.service';
import { CreateActorDto } from './dto/create-actor.dto';

@Controller('actors')
export class ActorsController {
  constructor(private readonly actorService: ActorsService) {}

  @ApiOperation({ summary: 'Get all actors' })
  @ApiResponse({ status: 200, type: [Actor] })
  @Get('')
  getAllMovies(): Promise<Actor[]> {
    return this.actorService.getAll();
  }

  @ApiOperation({ summary: 'Get one actor by id' })
  @ApiResponse({ status: 200, type: Actor })
  @Get('/:actor_id')
  getOneMovie(@Param('actor_id') actor_id: string): Promise<Actor> {
    return this.actorService.getOneById(Number(actor_id));
  }

  @ApiOperation({ summary: 'Create new actor' })
  @ApiResponse({ status: 201, type: Actor })
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('/create')
  createMovie(
    @Body() createActorDto: CreateActorDto,
    @UploadedFile() image: string,
  ): Promise<Actor> {
    return this.actorService.create({ ...createActorDto, image });
  }

  @ApiOperation({ summary: 'Delete actor' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('/:movie_id')
  deleteMovie(@Param('movie_id') movie_id: string): Promise<string> {
    return this.actorService.delete(Number(movie_id));
  }
}
