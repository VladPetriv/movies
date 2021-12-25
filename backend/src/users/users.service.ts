import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from '../roles/roles.service';
import { Repository } from 'typeorm';
import { BanUserDto } from './dto/ban-user.dto';
import { CreateUserDto } from './dto/creat-user.dto';
import { User } from './user.entity';
import { AddRoleDto } from './dto/add-role.dto';
import { FavouriteService } from '../favourite/favourite.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: RolesService,
    private readonly favouriteService: FavouriteService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const role = await this.roleService.getRoleByValue('USER');
    const favourite = await this.favouriteService.create();
    const user = this.userRepository.create({
      ...dto,
      roles: [role],
      favourite: favourite,
    });
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

  async deleteUser(email: string): Promise<string> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.delete({ id: user.id });
    return 'User was deleted';
  }
}
