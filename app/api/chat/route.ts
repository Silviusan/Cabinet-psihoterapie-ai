import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import { therapists } from '@/lib/therapists';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { messages, therapistId } = await req.json();

  const therapist = therapists.find(t => t.id === therapistId);
  if (!therapist) {
    return new Response('Terapeut negăsit', { status: 404 });
  }

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: therapist.systemPrompt,
    messages: messages,
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
