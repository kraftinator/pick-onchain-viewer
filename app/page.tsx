import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';

const frameMetadata = getFrameMetadata({

  image: {
    src: `${NEXT_PUBLIC_URL}/pick-onchain-main5.png`,
  },
  buttons: [
    {
      label: 'BEGIN',
      target: `${NEXT_PUBLIC_URL}/api/main`,
    },
  ]
});

export const metadata: Metadata = {
  title: 'Bracket Viewer',
  description: 'An unofficial Bracket Viewer for the Polymarket Madness competion',
  openGraph: {
    title: 'Bracket Viewer',
    description: 'An unofficial Bracket Viewer for the Polymarket Madness competion',
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>Sorry, the Bracket Viewer can only be viewed in a Frame.</h1>
    </>
  );
}
