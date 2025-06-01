import { Controller, Post, Body } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { MqttService } from '../mqtt/mqtt.service'; //  Import MQTT Service

@Controller('devices')
export class DevicesController {
  constructor(
    private readonly devicesService: DevicesService,
    private readonly mqttService: MqttService, // Inject MqttService
  ) {}

  @Post('data')
  async saveSensorData(
    @Body() body: { deviceId: string; sensorData: Record<string, any> },
  ) {
    // 1. Save sensor data to DB
    const saved = await this.devicesService.saveSensorData(
      body.deviceId,
      body.sensorData,
    );

    // 2. Publish to MQTT
    this.mqttService.publish(
      `devices/${body.deviceId}/data`, // Example topic
      JSON.stringify(body.sensorData),
    );

    return {
      message: 'Sensor data saved and published to MQTT',
      data: saved,
    };
  }
}
