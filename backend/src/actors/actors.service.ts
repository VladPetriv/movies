import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actor } from './actor.entity';
import { CreateActorDto } from './dto/create-actor.dto';
import { FilesService } from '../files/files.service';

@Injectable()
export class ActorsService {
  constructor(
    @InjectRepository(Actor)
    private readonly actorRepository: Repository<Actor>,
    private readonly fileService: FilesService,
  ) {}

  async getAll(): Promise<Actor[]> {
    return await this.actorRepository.find();
  }
  async getOneById(actor_id: number): Promise<Actor> {
    const actor = await this.actorRepository.findOne(actor_id);
    if (!actor) {
      throw new HttpException('Actor not found', HttpStatus.NOT_FOUND);
    }
    return actor;
  }
  async create(dto: CreateActorDto): Promise<Actor> {
    const fileName = await this.fileService.createFile(dto.image);
    const candidate = await this.actorRepository.findOne({
      where: { name: dto.name },
    });
    if (candidate) {
      throw new HttpException('Actor is exist', HttpStatus.BAD_REQUEST);
    }
    const actor = await this.actorRepository.create({
      ...dto,
      image: fileName,
    });
    await this.actorRepository.save(actor);
    return actor;
  }
  async delete(actor_id: number): Promise<string> {
    const actor = await this.actorRepository.findOne(actor_id);
    if (!actor) {
      throw new HttpException('Actor not found', HttpStatus.NOT_FOUND);
    }
    await this.actorRepository.delete({ id: actor.id });
    return 'Actor was deleted';
  }
}
