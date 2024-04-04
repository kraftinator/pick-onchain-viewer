import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  return new NextResponse(
    getFrameHtmlResponse({
      input: {
        text: 'Enter Token ID',
      },
      image: {
        src: `${NEXT_PUBLIC_URL}/spaghetti.jpg`,
        aspectRatio: '1:1',    
      },
      buttons: [
        {
          label: 'View Bracket',
          target: `${NEXT_PUBLIC_URL}/api/cat`,
        },
      ]
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';