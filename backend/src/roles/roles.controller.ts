import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotFoundError } from '../errors/NotFoundError';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './roles.entity';
import { RolesService } from './roles.service';

@ApiTags('Roles controller')
@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Post('/create')
  async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return await this.roleService.create(createRoleDto);
  }
  @Get('/:value')
  async getByValue(@Param('value') value: string): Promise<Role> {
    try {
      const role = await this.roleService.getRoleByValue(value);
      return role;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      }
    }
  }
}
