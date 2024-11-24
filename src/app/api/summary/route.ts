import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API Key');
}

const client = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  baseURL: 'https://chatapi.akash.network/api/v1',
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text to summarize is required' },
        { status: 400 }
      );
    }
    const prompt = `Summarize the following text:\n\n${text}`;

    const response = await client.chat.completions.create({
      model: 'Meta-Llama-3-1-405B-Instruct-FP8',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 50,
    });

    return NextResponse.json({
      //@ts-ignore
      summary: response.choices[0].message.content.trim(),
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to summarize text',
      },
      { status: 500 }
    );
  }
}
