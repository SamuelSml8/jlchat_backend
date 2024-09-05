import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/modules/users/dtos';
import { User, UserDocument } from 'src/modules/users/schemas/user.schema';
import { ApiResponse } from 'src/shared/interfaces/response.interface';
import { createResponse } from 'src/shared/utils/response.util';
import { HashService } from './hash.service';
import { TokenService } from './token.service';
import { Token } from 'src/common/types/token.type';
import { JwtPayload } from 'src/common/types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
  ) {}

  async register(user: CreateUserDto): Promise<ApiResponse<Token>> {
    const { name, lastName, email, password } = user;

    const userExists = await this.userModel.findOne({ email });
    if (userExists) {
      throw new HttpException(
        createResponse(false, 'User already exists', null),
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await this.hashService.hash(password);

    const newUser = new this.userModel({
      name,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const payload: JwtPayload = {
      sub: newUser._id.toString(),
      name: newUser.name,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
      chats: newUser.chats,
      groups: newUser.groups,
      friends: newUser.friends,
    };

    const tokenString = await this.tokenService.generateToken(payload, {
      expiresIn: '1h',
    });

    const token: Token = {
      accessToken: tokenString,
      expiresIn: '1h',
    };

    return createResponse(true, 'User created successfully', token);
  }
}
