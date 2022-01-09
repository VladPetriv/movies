import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGenreDto } from './dto/create-genre.dto';
import { Genre } from './genre.entity';

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
    if (!genre) return null;
    return genre;
  }
  async getOneByName(genre_name: string): Promise<Genre> {
    const genre = await this.genreRepository.findOne({
      where: { name: genre_name },
    });
    if (!genre) return null;
    return genre;
  }
  async create(dto: CreateGenreDto): Promise<Genre> {
    const candidate = await this.genreRepository.findOne({
      where: { name: dto.name },
    });
    if (candidate) return null;
    const genre = await this.genreRepository.create(dto);
    await this.genreRepository.save(genre);
    return genre;
  }
  async delete(genre_id: number): Promise<string> {
    const genre = await this.genreRepository.findOne(genre_id);
    if (!genre) return null;
    await this.genreRepository.delete(genre.id);
    return 'Genre was deleted';
  }
}
