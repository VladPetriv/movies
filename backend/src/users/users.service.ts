import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from '../roles/roles.service';
import { Repository } from 'typeorm';
import { BanUserDto } from './dto/ban-user.dto';
import { CreateUserDto } from './dto/creat-user.dto';
import { User } from './user.entity';
import { AddRoleDto } from './dto/add-role.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: RolesService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const role = await this.roleService.getRoleByValue('USER');
    const user = this.userRepository.create({ ...dto, roles: [role] });
    await this.userRepository.save(user);
    return user;
  }

  async getUserByEmail(email): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['roles'],
    });
  }

  async addRole(dto: AddRoleDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
      relations: ['roles'],
    });
    const role = await this.roleService.getRoleByValue(dto.value);
    if (role && user) {
      user.roles.push(role);
      await this.userRepository.save(user);
      return user;
    }
    throw new HttpException('User or role not found', HttpStatus.NOT_FOUND);
  }

  async banUser(dto: BanUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
      relations: ['roles'],
    });
    user.ban = true;
    user.banReason = dto.reason;
    await this.userRepository.save(user);
    return user;
  }
}
