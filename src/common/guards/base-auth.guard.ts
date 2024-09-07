import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../types/jwt-payload.type';
import { BlackListService } from 'src/modules/auth/services/black-list.service';
import { FastifyRequest } from 'fastify';

@Injectable()
export class BaseAuthGuard implements CanActivate {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly blackListService: BlackListService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const token = this.extractTokenFromHeader(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException('No JWT token provided');
    }

    if (
      await this.blackListService.isTokenBlackListed({ accessToken: token })
    ) {
      throw new UnauthorizedException('Token has been invalidated');
    }

    const decodedToken = this.verifyToken(token);
    if (!decodedToken) {
      throw new UnauthorizedException('Invalid token');
    }

    request['user'] = decodedToken;
    return this.validateRole(decodedToken, context);
  }

  protected validateRole(
    decodedToken: JwtPayload,
    context: ExecutionContext,
  ): boolean {
    return true;
  }

  private extractTokenFromHeader(authorizationHeader: string): string | null {
    if (!authorizationHeader) return null;
    const [, token] = authorizationHeader.split(' ');
    return token || null;
  }

  private verifyToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch {
      return null;
    }
  }
}
