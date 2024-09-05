import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsString, Max } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: 'The bio of the user' })
  @IsString()
  @Max(100, { message: 'The bio must have maximum of 100 characters' })
  bio: string;
}
