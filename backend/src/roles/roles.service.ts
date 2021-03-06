import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundError } from '../errors/NotFoundError';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async create(dto: CreateRoleDto): Promise<Role> {
    const role = await this.roleRepository.create(dto);
    await this.roleRepository.save(role);
    return role;
  }
  async getRoleByValue(value: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { value } });
    if (!role) throw new NotFoundError('Role not found');
    return role;
  }
}
