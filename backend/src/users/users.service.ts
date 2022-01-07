import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RolesService } from '../roles/roles.service';
import { FavouriteService } from '../favourite/favourite.service';
import { BanUserDto } from './dto/ban-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AddRoleDto } from './dto/add-role.dto';
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

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['roles', 'favourite'],
    });
    if (!user) return null;
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['roles', 'favourite'],
    });
  }

  async addRole(dto: AddRoleDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
      relations: ['roles', 'favourite'],
    });
    const role = await this.roleService.getRoleByValue(dto.value);
    if (role && user) {
      user.roles.push(role);
      await this.userRepository.save(user);
      return user;
    }
    return null;
  }

  async banUser(dto: BanUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
      relations: ['roles', 'favourite'],
    });
    if (!user) return null;

    user.ban = true;
    user.banReason = dto.reason;
    await this.userRepository.save(user);
    return user;
  }

  async deleteUser(email: string): Promise<string> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;

    await this.userRepository.delete({ id: user.id });
    return 'User was deleted';
  }
}
