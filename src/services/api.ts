// services/api.ts
import axios from 'axios';

export const fetchNumbers = async (count: number): Promise<number[]> => {
  try {
    const response = await axios.get<number[]>(
      `/api/v1.0/random?min=1&max=1000&count=${count}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching numbers:', error);
    return [];
  }
};
