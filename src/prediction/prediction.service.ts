import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PredictionDto } from './dto/prediction.dto';

@Injectable()
export class PredictionService {
  async predict(predictionDto: PredictionDto): Promise<any> {
    const predictionBackendUrl =
      process.env.PREDICTION_BACKEND_URL || 'http://localhost:8000';

    const response = await axios.post(
      `${predictionBackendUrl}/predict`,
      {
        rice_quantity: Number(predictionDto.rice_quantity),
        day_of_week: Number(predictionDto.day_of_week),
        month: Number(predictionDto.month),
        hour: Number(predictionDto.hour),
        minute: Number(predictionDto.minute),
        meal_type_encoded: Number(predictionDto.meal_type_encoded),
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status !== 200) {
      throw new Error('Prediction failed');
    }

    return response.data;
  }
}
