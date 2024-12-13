
import { Controller, Post, Body } from '@nestjs/common';
import { DevicesService } from './devices.service';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post('data')
  async saveSensorData(
    @Body() body: { deviceId: string; sensorData: Record<string, any> },
  ) {
    return this.devicesService.saveSensorData(body.deviceId, body.sensorData);
  }
}