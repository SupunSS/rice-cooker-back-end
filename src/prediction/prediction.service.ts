import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PredictionDto } from './dto/prediction.dto';

@Injectable()
export class PredictionService {
  async predict(predictionDto: PredictionDto): Promise<any> {
    const predictionBackendUrl =
      process.env.PREDICTION_BACKEND_URL || 'http://localhost:8000';

    // Log before sending
    const payload = {
      rice_quantity: Number(predictionDto.rice_quantity),
      day_of_week: Number(predictionDto.day_of_week),
      month: Number(predictionDto.month),
      meal_type_encoded: Number(predictionDto.meal_type_encoded),
    };

    console.log('Sending payload to ML server:', payload);

    // Basic validation check
    for (const [key, value] of Object.entries(payload)) {
      if (isNaN(value)) {
        throw new Error(`Invalid value for '${key}': ${value}`);
      }
    }
    try {
      const response = await axios.post(
        `${predictionBackendUrl}/predict`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('ML server error response:', error.response?.data);
        throw new Error(
          `Prediction failed: ${error.response?.data?.detail || 'Unknown error'}`,
        );
      }
      throw error;
    }
  }
}
