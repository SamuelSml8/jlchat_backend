import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import { FastifyRequest } from 'fastify';
import { BlackListService } from '../services/black-list.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly blackListService: BlackListService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload, request: FastifyRequest) {
    const token = request['token'];
    const isBlackListed = await this.blackListService.isTokenBlackListed(token);
    if (isBlackListed) {
      throw new UnauthorizedException('Token is blacklisted');
    }
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
