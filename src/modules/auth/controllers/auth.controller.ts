import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from 'src/modules/users/dtos';
import { LoginDto } from '../dtos/Login.dto';
import { Token } from 'src/common/types/token.type';
import { ApiResponse } from 'src/shared/interfaces/response.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<Token>> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse<Token>> {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  async logout(@Body() token: Token): Promise<ApiResponse<null>> {
    return this.authService.logout(token);
  }
}
