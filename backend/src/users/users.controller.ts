import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleGuard } from '../auth/roles.guard';
import { BanUserDto } from './dto/ban-user.dto';
import { CreateUserDto } from './dto/creat-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { AddRoleDto } from './dto/add-role.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 200, type: User })
  @Post('/create')
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @ApiOperation({ summary: 'Add new Role' })
  @ApiResponse({ status: 200, type: AddRoleDto })
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @Post('/addrole')
  addRole(@Body() addRoleDto: AddRoleDto): Promise<User> {
    return this.userService.addRole(addRoleDto);
  }
  @ApiOperation({ summary: 'Ban user' })
  @ApiResponse({ status: 200, type: User })
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @Post('/ban')
  banUser(@Body() banUserDto: BanUserDto): Promise<User> {
    return this.userService.banUser(banUserDto);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, type: 'User was deleted' })
  @Roles('USER')
  @UseGuards(AuthGuard)
  @Delete()
  deleteUser(@Body() email: string): Promise<string> {
    return this.userService.deleteUser(email);
  }
}
