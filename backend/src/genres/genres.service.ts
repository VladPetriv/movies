import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGenreDto } from './dto/create-genre.dto';
import { Genre } from './genre.entity';
import { NotFoundError } from '../errors/NotFoundError';
import { RecordIsExistError } from '../errors/RecordIsExistError';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async getAll(): Promise<Genre[]> {
    return await this.genreRepository.find();
  }

  async getOne(genre_id: number): Promise<Genre> {
    const genre = await this.genreRepository.findOne(genre_id);
    if (!genre) {
      throw new NotFoundError('Genre not found');
    }
    return genre;
  }
  async getOneByName(genre_name: string): Promise<Genre> {
    const genre = await this.genreRepository.findOne({
      where: { name: genre_name },
    });
    if (!genre) {
      throw new NotFoundError('Genre not found');
    }
    return genre;
  }
  async create(dto: CreateGenreDto): Promise<Genre> {
    const candidate = await this.genreRepository.findOne({
      where: { name: dto.name },
    });
    if (candidate) {
      throw new RecordIsExistError('Genre is exist');
    }
    const genre = await this.genreRepository.create(dto);
    await this.genreRepository.save(genre);
    return genre;
  }
  async delete(genre_id: number): Promise<string> {
    const genre = await this.genreRepository.findOne(genre_id);
    if (!genre) {
      throw new NotFoundError('Genre not found');
    }
    await this.genreRepository.delete(genre.id);
    return 'Genre was deleted';
  }
}
