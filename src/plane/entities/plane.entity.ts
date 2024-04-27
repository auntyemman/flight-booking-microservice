import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import moment from 'moment';
import { Moment } from 'moment';

export type PlaneDocument = Plane & Document;

@Schema()
export class Plane {
  @Prop({ type: String, required: true })
  manufacturer: string;

  @Prop({ type: String, required: true })
  model: string;

  @Prop({ type: String, required: true })
  capacity: string;

  @Prop({ type: String, required: true })
  registrationNumber: string;

  @Prop({ type: String, required: true })
  creator: string;

  @Prop({ default: () => moment().utc().toDate(), type: Date })
  createdAt: Moment;
}

export const PlaneSchema = SchemaFactory.createForClass(Plane);
