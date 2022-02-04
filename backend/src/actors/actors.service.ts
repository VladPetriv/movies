import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundError } from '../errors/NotFoundError';
import { RecordIsExistError } from '../errors/RecordIsExistError';
import { FilesService } from '../files/files.service';
import { MoviesService } from '../movies/movies.service';
import { Actor } from './actor.entity';
import { CreateActorDto } from './dto/create-actor.dto';

@Injectable()
export class ActorsService {
  constructor(
    @InjectRepository(Actor)
    private readonly actorRepository: Repository<Actor>,
    private readonly fileService: FilesService,
    private readonly movieService: MoviesService,
  ) {}

  async getAll(): Promise<Actor[]> {
    return await this.actorRepository.find();
  }

  async getOneById(actor_id: number): Promise<Actor> {
    const actor = await this.actorRepository.findOne(actor_id);
    if (!actor) {
      throw new NotFoundError('Actor not found');
    }
    return actor;
  }

  async create(dto: CreateActorDto, movie_id: number): Promise<Actor> {
    const fileName = await this.fileService.createFile(dto.image);
    const candidate = await this.actorRepository.findOne({
      where: { name: dto.name },
    });
    const movie = await this.movieService.getOneMovie(movie_id);
    if (candidate) {
      throw new RecordIsExistError('Actor is exist');
    }
    const actor = await this.actorRepository.create({
      ...dto,
      image: fileName,
      movie: movie,
    });
    await this.actorRepository.save(actor);
    return actor;
  }

  async delete(actor_id: number): Promise<string> {
    const actor = await this.actorRepository.findOne(actor_id);
    if (!actor) {
      throw new NotFoundError('Actor not found');
    }
    await this.actorRepository.delete({ id: actor.id });
    return 'Actor was deleted';
  }
}
