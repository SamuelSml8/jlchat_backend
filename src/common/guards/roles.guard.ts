import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BaseAuthGuard } from './base-auth.guard';
import { JwtPayload } from '../types/jwt-payload.type';
import { Role } from '../enums/roles.enum';
import { BlackListService } from 'src/modules/auth/services/black-list.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard extends BaseAuthGuard {
  constructor(
    jwtService: JwtService,
    blackListService: BlackListService,
    private reflector: Reflector,
  ) {
    super(jwtService, blackListService);
  }

  protected validateRole(
    decodedToken: JwtPayload,
    context: ExecutionContext,
  ): boolean {
    const requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (!requiredRoles.includes(decodedToken.role)) {
      throw new ForbiddenException('You do not have the required role');
    }

    return true;
  }
}
