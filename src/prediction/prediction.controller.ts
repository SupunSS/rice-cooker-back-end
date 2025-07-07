import { Body, Controller, Post } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { PredictionDto } from './dto/prediction.dto';

@Controller('prediction')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Post('predict')
  async predict(@Body() predictionDto: PredictionDto) {
    try {
      const prediction = await this.predictionService.predict(predictionDto);
      return {
        message: 'Prediction successful',
        prediction,
      };
    } catch (error) {
      return {
        message: 'Prediction failed',
        error: error.message,
      };
    }
  }
}
