import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/common/types/jwt-payload.type';

@Injectable()
export class TokenService {
  private readonly jwtSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!this.jwtSecret) {
      throw new InternalServerErrorException('JWT Secret key not found');
    }
  }

  async generateToken(payload: JwtPayload, options?: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.jwtSecret,
      ...options,
    });
  }
}
