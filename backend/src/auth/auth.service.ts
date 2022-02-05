import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { NotFoundError } from '../errors/NotFoundError';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async registration(dto: CreateUserDto) {
    try {
      const candidate = await this.userService.getUserByEmail(dto.email);
      if (candidate) {
        throw new HttpException(
          'User with this email is exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      return this.configureUser(dto);
    } catch (err) {
      if (err instanceof NotFoundError) {
        return this.configureUser(dto);
      }
    }
  }
  async login(dto: CreateUserDto) {
    const user = await this.validateUser(dto);
    return this.generateToken(user);
  }
  private async generateToken(user: User) {
    const payload = { email: user.email, id: user.id, roles: user['roles'] };

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

  private async configureUser(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.userService.createUser({
      ...dto,
      password: hashedPassword,
    });
    return this.generateToken(user);
  }
}
