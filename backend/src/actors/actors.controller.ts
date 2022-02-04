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
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleGuard } from '../auth/roles.guard';
import { NotFoundError } from '../errors/NotFoundError';
import { RecordIsExistError } from '../errors/RecordIsExistError';
import { Actor } from './actor.entity';
import { ActorsService } from './actors.service';
import { CreateActorDto } from './dto/create-actor.dto';

@ApiTags('Actor controller')
@UsePipes(new ValidationPipe())
@Controller('actors')
export class ActorsController {
  constructor(private readonly actorService: ActorsService) {}

  @ApiOperation({ summary: 'Get all actors' })
  @ApiResponse({ status: 200, type: [Actor] })
  @Get('')
  async getAllActors(): Promise<Actor[]> {
    return await this.actorService.getAll();
  }

  @ApiOperation({ summary: 'Get one actor by id' })
  @ApiResponse({ status: 200, type: Actor })
  @Get('/:actor_id')
  async getOneActor(@Param('actor_id') actor_id: string): Promise<Actor> {
    try {
      const actor = await this.actorService.getOneById(Number(actor_id));
      return actor;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      }
    }
  }

  @ApiOperation({ summary: 'Create new actor' })
  @ApiResponse({ status: 201, type: Actor })
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('/:movie_id/create')
  async createActor(
    @Param('movie_id') movie_id: string,
    @Body() createActorDto: CreateActorDto,
    @UploadedFile() image: string,
  ): Promise<Actor> {
    try {
      const actor = await this.actorService.create(
        { ...createActorDto, image },
        Number(movie_id),
      );
      return actor;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      } else if (err instanceof RecordIsExistError) {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @ApiOperation({ summary: 'Delete actor' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('/:actor_id')
  async deleteActor(@Param('actor_id') actor_id: string): Promise<string> {
    try {
      const actor = await this.actorService.delete(Number(actor_id));
      return actor;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      }
    }
  }
}
