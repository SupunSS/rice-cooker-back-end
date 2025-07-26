import { Module } from '@nestjs/common';
import { PredictionController } from './prediction.controller';
import { PredictionService } from './prediction.service';

@Module({
  imports: [],
  controllers: [PredictionController],
  providers: [PredictionService],
})
export class PredictctionModule {}
