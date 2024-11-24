import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

let client: OpenAI | null = null;

if (process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
  client = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    baseURL: 'https://chatapi.akash.network/api/v1'
  });
} else {
  console.warn('OpenAI API Key is missing, the model functionality may not work.');
}

export async function POST(request: Request) {
  try {
    const { prompt, language, temperature } = await request.json();

    if (!prompt || !language) {
      return NextResponse.json(
        { error: 'Prompt and language are required' },
        { status: 400 }
      );
    }
    const validTemperature = typeof temperature === 'number' && temperature >= 0 && temperature <= 1 ? temperature : 0.2;
    const enhancedPrompt = `Write the following in ${language}:\n${prompt}\n\nProvide only the code without any explanations.`;
    if (!client) {
      return NextResponse.json(
        { error: 'OpenAI API key is missing. Model functionality is unavailable.' },
        { status: 500 }
      );
    }
    const response = await client.chat.completions.create({
      model: 'Meta-Llama-3-1-8B-Instruct-FP8',
      messages: [
        {
          role: 'user',
          content: enhancedPrompt
        }
      ],
      temperature: validTemperature,
      max_tokens: 500
    });
    return NextResponse.json({
      //@ts-expect-error: Suppressing type error due to dynamic content structure
      content: response.choices[0].message.content.trim()
    });
  } catch (error: unknown) {
    console.error('Error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: error.message || 'Failed to generate code'
        },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { 
          error: 'Failed to generate code' 
        },
        { status: 500 }
      );
    }
  }
}
