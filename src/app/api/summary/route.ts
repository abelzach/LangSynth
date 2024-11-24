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
      //@ts-expect-error: Suppressing type error due to dynamic content structure
      summary: response.choices[0].message.content.trim(),
    });
  } catch (error: unknown) {
  console.error('Error:', error);

  if (error instanceof Error) {
    return NextResponse.json(
      { 
        error: error.message || 'Failed to summarise text'
      },
      { status: 500 }
    );
  } else {
    return NextResponse.json(
      { 
        error: 'Failed to summarise text' 
      },
      { status: 500 }
    );
  }
}
}
