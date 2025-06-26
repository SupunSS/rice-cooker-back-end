
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device } from 'src/devices/schemas/devices.schema';

@Injectable()
export class DevicesService {
  constructor(@InjectModel(Device.name) private deviceModel: Model<Device>) {}

  async saveSensorData(deviceId: string, data: Record<string, any>) {
    const device = await this.deviceModel.findOneAndUpdate(
      { deviceId },
      { sensorData: data },
      { upsert: true, new: true },
    );
    return device;
  }
}