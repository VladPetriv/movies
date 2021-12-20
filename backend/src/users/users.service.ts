import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from '../roles/roles.service';
import { Repository } from 'typeorm';
import { BanUserDto } from './dto/ban-user.dto';
import { CreateUserDto } from './dto/creat-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: RolesService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create(dto);
    const role = await this.roleService.getRoleByValue('USER');
    user.roles = [role];
    await this.userRepository.save(user);
    return user;
  }
  async getUserByEmail(email): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
    return user;
  }
  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find({ relations: ['roles'] });
    return users;
  }
  async banUser(dto: BanUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });
    user.ban = true;
    user.banReason = dto.reason;
    await this.userRepository.save(user);
    return user;
  }
}
