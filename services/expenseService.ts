import axios from 'axios';

const API_URL = 'http://10.173.89.54:5000';

export interface PredictionData {
    amount: string | null;
    date: string | null;
    entity: string | null;
    category: string;
    confidence: number;
    description: string;
}

export interface PredictionResponse {
    success: boolean;
    data: PredictionData | PredictionData[];
    error?: string;
}

/**
 * Predict expense from text using the ML API
 * @param text - Single text string or array of text strings
 * @returns Promise with prediction results
 */
export const predictExpense = async (
    text: string | string[]
): Promise<PredictionResponse> => {
    try {
        const requestBody = Array.isArray(text) ? { texts: text } : { text };
        console.log("hittting backend....");

        const response = await axios.post<PredictionResponse>(
            `${API_URL}/predict`,
            requestBody
        );
        console.log("data", response.data);


        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('API Error:', error.response?.data || error.message);
            return {
                success: false,
                data: Array.isArray(text) ? [] : {
                    amount: null,
                    date: null,
                    entity: null,
                    category: 'Unknown',
                    confidence: 0,
                    description: Array.isArray(text) ? '' : text,
                },
                error: error.response?.data?.error || error.message,
            };
        }
        throw error;
    }
};
