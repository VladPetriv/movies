import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleGuard } from '../auth/roles.guard';
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
    const actor = await this.actorService.getOneById(Number(actor_id));
    if (!actor) {
      throw new HttpException('Actor not found', HttpStatus.NOT_FOUND);
    }
    return actor;
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
    const actor = await this.actorService.create(
      { ...createActorDto, image },
      Number(movie_id),
    );
    if (!actor) {
      throw new HttpException(
        'Actor is exist or movie not found',
        HttpStatus.BAD_REQUEST,
      );
    }
    return actor;
  }

  @ApiOperation({ summary: 'Delete actor' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('/:actor_id')
  async deleteActor(@Param('actor_id') actor_id: string): Promise<string> {
    const actor = await this.actorService.delete(Number(actor_id));
    if (!actor) {
      throw new HttpException('Actor not found', HttpStatus.NOT_FOUND);
    }
    return actor;
  }
}
