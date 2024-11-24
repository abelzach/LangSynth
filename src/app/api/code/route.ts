import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API Key');
}

const client = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  baseURL: 'https://chatapi.akash.network/api/v1'
});

export async function POST(request: Request) {
  try {
    const { prompt, language } = await request.json();

    if (!prompt || !language) {
      return NextResponse.json(
        { error: 'Prompt and language are required' },
        { status: 400 }
      );
    }

    const enhancedPrompt = `Write the following in ${language}:\n${prompt}\n\nProvide only the code without any explanations.`;

    const response = await client.chat.completions.create({
      model: 'Meta-Llama-3-1-8B-Instruct-FP8',
      messages: [
        {
          role: 'user',
          content: enhancedPrompt
        }
      ],
      temperature: 0.2, 
      max_tokens: 500
    });

    return NextResponse.json({
        //@ts-ignore
      content: response.choices[0].message.content.trim()
    });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate code'
      },
      { status: 500 }
    );
  }
}