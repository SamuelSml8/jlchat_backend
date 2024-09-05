import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { BlackListService } from '../auth/services/black-list.service';
import { BlackListSchema } from '../auth/schemas/black-list.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'BlackList', schema: BlackListSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService, BlackListService, RolesGuard],
})
export class UsersModule {}
