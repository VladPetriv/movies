import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const authHeaders = req.headers.authorization;
      const bearer = authHeaders.split(' ')[0];
      const token = authHeaders.split(' ')[1];
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: 'User is not logined' });
      }
      const user = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });
      req.user = user;
      return true;
    } catch (err) {
      throw new UnauthorizedException({ message: 'User is not logined' });
    }
  }
}
