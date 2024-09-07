import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Chat extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
  members: Types.ObjectId[];

  @Prop({ default: false })
  isGroup: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
