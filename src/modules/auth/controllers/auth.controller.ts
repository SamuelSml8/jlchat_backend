import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from 'src/modules/users/dtos';
import { LoginDto } from '../dtos/Login.dto';
import { Token } from 'src/common/types/token.type';
import { ApiResponse } from 'src/shared/interfaces/response.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as ApiResponseDoc,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { FastifyRequest } from 'fastify';
import { create } from 'domain';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    description: 'The details of the user to register',
    type: CreateUserDto,
  })
  @ApiResponseDoc({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        success: true,
        message: 'User created successfully',
        data: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5c...',
          expiresIn: '1h',
        } as Token,
      },
    },
  })
  @ApiResponseDoc({
    status: 400,
    description: 'User already exists',
    schema: {
      example: {
        success: false,
        message: 'User already exists',
        data: null,
      },
    },
  })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<Token>> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({
    description: 'The credentials for logging in',
    type: LoginDto,
  })
  @ApiResponseDoc({
    status: 200,
    description: 'User logged in successfully',
    schema: {
      example: {
        success: true,
        message: 'User logged in successfully',
        data: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5c...',
          expiresIn: '1h',
        } as Token,
      },
    },
  })
  @ApiResponseDoc({
    status: 401,
    description: 'Invalid credentials or inactive account',
    schema: {
      example: {
        success: false,
        message: 'Email or password incorrect',
        data: null,
      },
    },
  })
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse<Token>> {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Logout a user and invalidate the token' })
  @ApiBody({
    description: 'The token to be invalidated',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5c...',
      },
    },
  })
  @ApiResponseDoc({
    status: 200,
    description: 'User logged out successfully',
    schema: {
      example: {
        success: true,
        message: 'User logged out successfully',
        data: null,
      },
    },
  })
  @ApiResponseDoc({
    status: 400,
    description: 'Invalid token',
    schema: {
      example: {
        success: false,
        message: 'Invalid token',
        data: null,
      },
    },
  })
  async logout(@Req() request: FastifyRequest): Promise<ApiResponse<Token>> {
    const tokenString = request.headers.authorization?.split(' ')[1];
    const token: Token = { accessToken: tokenString };
    return this.authService.logout(token);
  }

  @Get('validate-token')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate the token' })
  @ApiResponseDoc({
    status: 200,
    description: 'Token is valid',
    schema: {
      example: {
        success: true,
        message: 'Token is valid',
        data: null,
      },
    },
  })
  async validateToken(): Promise<ApiResponse<Token>> {
    return this.authService.validateToken();
  }
}
