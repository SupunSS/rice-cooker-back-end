import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './User/users.module';
import { DevicesModule } from './devices/devices.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuthModule } from './auth/auth.module';
import { MqttModule } from './mqtt/mqtt.module';
import { PredictctionModule } from './prediction/prediction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: 'intelligent-cooker',
    }),

    UsersModule,
    DevicesModule,
    NotificationsModule,
    AuthModule,
    MqttModule,
    PredictctionModule,
  ],
})
export class AppModule {}
