import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/common/enums/roles.enum';
import { Status } from 'src/common/enums/user-status.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: '' })
  profilePicture: string;

  @Prop({ default: Role.USER, enum: Role })
  role: Role;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: [] })
  chats: string[];

  @Prop({ default: [] })
  groups: string[];

  @Prop({ default: '' })
  bio: string;

  @Prop({ default: [] })
  friends: string[];

  @Prop({ default: Status.OFFLINE, enum: Status })
  status: Status;

  @Prop()
  lastLogin: Date;

  @Prop({ default: false })
  isOnline: boolean;

  @Prop()
  lastActiveAt: Date;

  @Prop()
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 });
