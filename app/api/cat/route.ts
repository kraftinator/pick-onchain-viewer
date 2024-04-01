import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

import { encodeFunctionData, parseEther } from 'viem';
import { base } from 'viem/chains';
import PickOnchainABI from '../../_contracts/PickOnchainABI';
import { PICK_ONCHAIN_CONTRACT_ADDR } from '../../config';
import type { FrameTransactionResponse } from '@coinbase/onchainkit/frame';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();

  let tokenId: bigint = 371n;

  const data = encodeFunctionData({
    abi: PickOnchainABI,
    functionName: 'ViewPickByTokenID',
    args: [tokenId],
  });

  const txData: FrameTransactionResponse = {
    chainId: `eip155:${base.id}`,
    method: 'eth_sendTransaction',
    params: {
      abi: [],
      data,
      to: PICK_ONCHAIN_CONTRACT_ADDR,
      //value: '0',
      value: parseEther('0.00004').toString(), // 0.00004 ETH
    },
  };
  return NextResponse.json(txData);

  /*
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'The Cat Page',
        },
        {
          action: 'link',
          label: 'OnchainKit',
          target: 'https://onchainkit.xyz',
        },
        {
          action: 'post_redirect',
          label: 'Dog pictures',
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/cat1.jpg`,
      },
    }),
  );
  */
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
