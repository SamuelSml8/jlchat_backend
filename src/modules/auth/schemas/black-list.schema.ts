import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlackListDocument = BlackList & Document;

@Schema({ timestamps: true })
export class BlackList {
  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true, default: Date.now(), expires: '1d' })
  createdAt: Date;
}

export const BlackListSchema = SchemaFactory.createForClass(BlackList);
