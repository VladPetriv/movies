import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleGuard } from '../auth/roles.guard';
import { BanUserDto } from './dto/ban-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { AddRoleDto } from './dto/add-role.dto';
import { NotFoundError } from '../errors/NotFoundError';
@ApiTags('Users controller')
@UsePipes(new ValidationPipe())
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  @ApiOperation({ summary: 'Add new Role' })
  @ApiResponse({ status: 200, type: AddRoleDto })
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @Post('/addrole')
  async addRole(@Body() addRoleDto: AddRoleDto): Promise<User> {
    try {
      const user = await this.userService.addRole(addRoleDto);
      return user;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      }
    }
  }
  @ApiOperation({ summary: 'Ban user' })
  @ApiResponse({ status: 200, type: User })
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @Post('/ban')
  async banUser(@Body() banUserDto: BanUserDto): Promise<User> {
    try {
      const user = await this.userService.banUser(banUserDto);
      return user;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      }
    }
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, type: 'User was deleted' })
  @Roles('USER')
  @UseGuards(AuthGuard)
  @Delete()
  async deleteUser(@Body() email: string): Promise<string> {
    try {
      const user = await this.userService.deleteUser(email);
      return user;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      }
    }
  }
}
