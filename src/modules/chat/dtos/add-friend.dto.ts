import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class AddFriendDto {
  @ApiProperty({
    type: String,
    description: 'ID of the user to add as friend',
  })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  friendId: string;

  @ApiProperty({
    type: String,
    description: 'ID of the user that wants to add a friend',
  })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  userId: string;
}
