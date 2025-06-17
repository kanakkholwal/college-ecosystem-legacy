
import { google } from '@ai-sdk/google';

export const safetySettings = [
    { category: 'HARM_CATEGORY_UNSPECIFIED', threshold: 'BLOCK_LOW_AND_ABOVE' },
]

// export const model = deepseek("deepseek-chat");
export const model = google('gemini-1.5-pro-latest');

export const modelId ='gemini-1.5-pro-latest';

