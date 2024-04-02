import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

import { encodeFunctionData, parseEther } from 'viem';
import { base } from 'viem/chains';
import PickOnchainABI from '../../_contracts/PickOnchainABI';
import { PICK_ONCHAIN_CONTRACT_ADDR } from '../../config';
import type { FrameTransactionResponse } from '@coinbase/onchainkit/frame';

import { createPublicClient, http } from 'viem';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();

  let tokenId1: bigint = 371n;
  let tokenId2: bigint = 372n;
  let tokens: bigint[] = [tokenId1, tokenId2];

  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  console.log('FLAG A');

  const picks = await publicClient.readContract({
    address: PICK_ONCHAIN_CONTRACT_ADDR,
    abi: PickOnchainABI,
    functionName: 'ViewPicksByTokenIDs',
    args: [tokens],
  })// as Player[];

  console.log('FLAG B');
  console.log('FLAG C');
  console.log('publicClient', publicClient);
  console.log('picks', picks);
  console.log('FLAG D');

  return NextResponse.json(picks);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';