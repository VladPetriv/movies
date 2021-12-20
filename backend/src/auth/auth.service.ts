import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../users/dto/creat-user.dto';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async registration(dto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(dto.email);
    if (candidate) {
      throw new HttpException(
        'User with this email is exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.userService.createUser({
      ...dto,
      password: hashedPassword,
    });
    return this.generateToken(user);
  }
  async login(dto: CreateUserDto) {
    const user = await this.validateUser(dto);
    return this.generateToken(user);
  }
  private async generateToken(user: User) {
    const payload = { email: user.email, id: user.id };
    return {
      token: this.jwtService.sign(payload, {
        secret: process.env.SECRET_KEY,
      }),
    };
  }
  private async validateUser(dto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(dto.email);
    const comparedPassword = await bcrypt.compare(dto.password, user.password);
    if (user && comparedPassword) {
      return user;
    }
    throw new UnauthorizedException({ message: 'Incorrect email or password' });
  }
}
