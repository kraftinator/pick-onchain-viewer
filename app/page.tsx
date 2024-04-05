import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';

const frameMetadata = getFrameMetadata({
  image: {
    src: `${NEXT_PUBLIC_URL}/pick-onchain-main.png`,
    //aspectRatio: '1:1',    
  },
  buttons: [
    {
      label: 'BEGIN',
      target: `${NEXT_PUBLIC_URL}/api/main`,
    },
  ]
});

/*
const frameMetadata = getFrameMetadata({
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
});
*/

/*
const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Link to Cat',
      target: `${NEXT_PUBLIC_URL}/api/cat`,
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    },
    {
      label: 'Link to mfer',
      target: `${NEXT_PUBLIC_URL}/api/mfer`,
    },
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/spaghetti.jpg`,
    aspectRatio: '1:1',
  },
  postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
});
*/

/*
const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Story time',
    },
    {
      action: 'tx',
      label: 'Send Base Sepolia',
      target: `${NEXT_PUBLIC_URL}/api/tx`,
      postUrl: `${NEXT_PUBLIC_URL}/api/tx-success`,
    },
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/park-3.png`,
    aspectRatio: '1:1',
  },
  input: {
    text: 'Tell me a story',
  },
  postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
});
*/

export const metadata: Metadata = {
  title: 'zizzamia.xyz',
  description: 'LFG',
  openGraph: {
    title: 'zizzamia.xyz',
    description: 'LFG',
    images: [`${NEXT_PUBLIC_URL}/park-1.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>kraftinator</h1>
    </>
  );
}
