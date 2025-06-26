import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { Device, DeviceSchema } from 'src/devices/schemas/devices.schema';
import { MqttModule } from '../mqtt/mqtt.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    MqttModule,
  ], // Import MqttModule to use MQTT service
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class DevicesModule {}
