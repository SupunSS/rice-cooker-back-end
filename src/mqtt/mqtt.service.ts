import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit {
  private client: mqtt.MqttClient;

  onModuleInit() {
    this.client = mqtt.connect('mqtt://broker.hivemq.com'); // use your broker here

    this.client.on('connect', () => {
      console.log('[MQTT] Connected to broker successfully');
      this.client.subscribe('cooker/status'); // subscribe to topic
    });

    this.client.on('message', (topic, message) => {
      console.log(`[MQTT] ${topic}: ${message.toString()}`);
      // Handle incoming messages here
    });
  }

  publish(topic: string, payload: string) {
    this.client.publish(topic, payload);
  }
}
