import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Device extends Document {
  @Prop({ required: true })
  deviceId: string;

  @Prop({ type: Object })
  sensorData: Record<string, any>;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
