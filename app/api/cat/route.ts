import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { encodeFunctionData, parseEther } from 'viem';
import { base } from 'viem/chains';
import PickOnchainABI from '../../_contracts/PickOnchainABI';
import { PICK_ONCHAIN_CONTRACT_ADDR } from '../../config';
import type { FrameTransactionResponse } from '@coinbase/onchainkit/frame';
import { createPublicClient, http } from 'viem';

let getPicks = false;
let currentPage = 'EAST';
let picks: string[] = [];
let currentTokenId = BigInt(0);

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  //if (currentPage === 'EAST' && currentTokenId !== BigInt(0)) {
  //}
  
  /*
  if (currentTokenId !== BigInt(0)) {
    if (message?.button === 1) {
      currentPage = 'EAST';
    } else if (message?.button === 2) {
      currentPage = 'WEST';
    } else if (message?.button === 3) {
      currentPage = 'SOUTH';
    } else if (message?.button === 4) {
      currentPage = 
    }
    }
  }
*/

  if (currentTokenId !== BigInt(0)) {
    if (currentPage === 'EAST' && message?.button === 1) {
      currentPage = 'FINAL_FOUR';
    } else if (currentPage === 'EAST' && message?.button === 2) {
      currentPage = 'WEST';
    } else if (currentPage === 'WEST' && message?.button === 1) {
      currentPage = 'EAST';
    } else if (currentPage === 'WEST' && message?.button === 2) {
      currentPage = 'SOUTH';
    } else if (currentPage === 'SOUTH' && message?.button === 1) {
      currentPage = 'WEST';
    } else if (currentPage === 'SOUTH' && message?.button === 2) {
      currentPage = 'MIDWEST';
    } else if (currentPage === 'MIDWEST' && message?.button === 1) {
      currentPage = 'SOUTH';
    } else if (currentPage === 'MIDWEST' && message?.button === 2) {
      currentPage = 'FINAL_FOUR';
    } else if (currentPage === 'FINAL_FOUR' && message?.button === 1) {
      currentPage = 'MIDWEST';
    } else if (currentPage === 'FINAL_FOUR' && message?.button === 2) {
      currentPage = 'EAST';
    }
  }

  //const text = message.input || '';
  const inputTokenId = message.input || 1;
  let tokenId: bigint = BigInt(inputTokenId);
  if (currentTokenId === BigInt(0)) {
    currentTokenId = tokenId;
  } else {
    tokenId = currentTokenId;
  }

  console.log('tokenId', tokenId);
  console.log('message?.button', message?.button);
  console.log('currentPage', currentPage);

  // Get picks
  //let tokenId: bigint = 371n;
  if (!getPicks) {
    console.log('Loading picks from contract....')
    const publicClient = createPublicClient({
      chain: base,
      transport: http(),
    });


    const contractPicks = await publicClient.readContract({
      address: PICK_ONCHAIN_CONTRACT_ADDR,
      abi: PickOnchainABI,
      functionName: 'ViewPickByTokenID',
      args: [tokenId],
    });

    picks = contractPicks as string[];
    console.log('picks', picks);
    getPicks = true;
  }
  // END Get Picks

  const svgContentEast: string = `
    <svg viewBox='0 0 800 550' xmlns="http://www.w3.org/2000/svg">
      <!-- ********** EAST ********** -->

      <!-- ***** ROUND 1 ***** -->
      <!-- Rectangles -->
      <rect x="5" y="38" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="62" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="98" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="122" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="158" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="182" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="218" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="242" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="278" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="302" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="338" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="362" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="398" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="422" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="458" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="482" width="140" height="24" fill="lightgrey" stroke="black"/>
      <!-- Team Labels -->
      <text x="10" y="57" font-family="Arial" font-size="16">Uconn</text>
      <text x="10" y="81" font-family="Arial" font-size="16">Stetson</text>
      <text x="10" y="117" font-family="Arial" font-size="16">Florida Atlantic</text>
      <text x="10" y="141" font-family="Arial" font-size="16">Northwestern</text>
      <text x="10" y="177" font-family="Arial" font-size="16">San Diego St</text>
      <text x="10" y="201" font-family="Arial" font-size="16">UAB</text>
      <text x="10" y="237" font-family="Arial" font-size="16">Auburn</text>
      <text x="10" y="261" font-family="Arial" font-size="16">Yale</text>
      <text x="10" y="297" font-family="Arial" font-size="16">BYU</text>
      <text x="10" y="321" font-family="Arial" font-size="16">Duquesne</text>
      <text x="10" y="357" font-family="Arial" font-size="16">Illinois</text>
      <text x="10" y="381" font-family="Arial" font-size="16">Morehead St</text>
      <text x="10" y="417" font-family="Arial" font-size="16">Washington St</text>
      <text x="10" y="441" font-family="Arial" font-size="16">Drake</text>
      <text x="10" y="477" font-family="Arial" font-size="16">Iowa St</text>
      <text x="10" y="501" font-family="Arial" font-size="16">South Dagota St</text>

      <!-- ***** ROUND 2 ***** -->
      <!-- Rectangles -->
      <rect x="210" y="68" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="210" y="92" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="210" y="188" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="210" y="212" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="210" y="308" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="210" y="332" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="210" y="428" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="210" y="452" width="140" height="24" fill="lightgrey" stroke="black"/>
      <!-- Team Labels -->
      <text x="215" y="86" font-family="Arial" font-size="16">${picks[0]}</text>
      <text x="215" y="110" font-family="Arial" font-size="16">${picks[1]}</text>
      <text x="215" y="206" font-family="Arial" font-size="16">${picks[2]}</text>
      <text x="215" y="230" font-family="Arial" font-size="16">${picks[3]}</text>
      <text x="215" y="326" font-family="Arial" font-size="16">${picks[4]}</text>
      <text x="215" y="350" font-family="Arial" font-size="16">${picks[5]}</text>
      <text x="215" y="446" font-family="Arial" font-size="16">${picks[6]}</text>
      <text x="215" y="470" font-family="Arial" font-size="16">${picks[7]}</text>
      <!-- Lines -->
      <path d="M 145,62 H 175 V 92 H 209" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 145,122 H 175 V 92 H 209" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 145,182 H 175 V 212 H 209" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 145,242 H 175 V 212 H 209" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 145,302 H 175 V 332 H 209" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 145,362 H 175 V 332 H 209" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 145,422 H 175 V 452 H 209" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 145,482 H 175 V 452 H 209" stroke="black" stroke-width="2" fill="none"/>

      <!-- ***** ROUND 3 ***** -->
      <!-- Rectangles -->
      <rect x="415" y="130" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="415" y="154" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="415" y="370" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="415" y="394" width="140" height="24" fill="lightgrey" stroke="black"/>
      <!-- Team Lables -->
      <text x="420" y="148" font-family="Arial" font-size="16">${picks[32]}</text>
      <text x="420" y="172" font-family="Arial" font-size="16">${picks[33]}</text>
      <text x="420" y="388" font-family="Arial" font-size="16">${picks[34]}</text>
      <text x="420" y="412" font-family="Arial" font-size="16">${picks[35]}</text>
      <!-- Lines -->
      <path d="M 350,92 H 380 V 154 H 415" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 350,212 H 380 V 154 H 415" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 350,332 H 380 V 394 H 415" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 350,452 H 380 V 394 H 415" stroke="black" stroke-width="2" fill="none"/>
      
      <!-- ***** ROUND 4 ***** -->
      <!-- Rectangles -->
      <rect x="630" y="248" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="630" y="272" width="140" height="24" fill="lightgrey" stroke="black"/>
      <!-- Team Labels -->
      <text x="635" y="266" font-family="Arial" font-size="16">${picks[48]}</text>
      <text x="635" y="290" font-family="Arial" font-size="16">${picks[49]}</text>
      <!-- Lines -->
      <path d="M 555,154 H 585 V 272 H 630" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 555,394 H 585 V 272 H 630" stroke="black" stroke-width="2" fill="none"/>
    </svg>
  `;

  const svgContentWest: string = `
    <svg viewBox='0 0 800 550' xmlns="http://www.w3.org/2000/svg">
      <!-- ********** WEST ********** -->

      <!-- ***** ROUND 1 ***** -->
      <!-- Rectangles -->
      <rect x="5" y="38" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="62" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="98" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="122" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="158" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="182" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="218" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="242" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="278" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="302" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="338" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="362" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="398" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="422" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="458" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="482" width="140" height="24" fill="lightgrey" stroke="black"/>
      <!-- Team Labels -->
      <text x="10" y="57" font-family="Arial" font-size="16">North Carolina</text>
      <text x="10" y="81" font-family="Arial" font-size="16">Wagner</text>
      <text x="10" y="117" font-family="Arial" font-size="16">Mississippi St</text>
      <text x="10" y="141" font-family="Arial" font-size="16">Michigan St</text>
      <text x="10" y="177" font-family="Arial" font-size="16">Saint Mary's</text>
      <text x="10" y="201" font-family="Arial" font-size="16">Grand Canyon</text>
      <text x="10" y="237" font-family="Arial" font-size="16">Alabama</text>
      <text x="10" y="261" font-family="Arial" font-size="16">Charleston</text>
      <text x="10" y="297" font-family="Arial" font-size="16">Clemson</text>
      <text x="10" y="321" font-family="Arial" font-size="16">New Mexico</text>
      <text x="10" y="357" font-family="Arial" font-size="16">Baylor</text>
      <text x="10" y="381" font-family="Arial" font-size="16">Colgate</text>
      <text x="10" y="417" font-family="Arial" font-size="16">Dayton</text>
      <text x="10" y="441" font-family="Arial" font-size="16">Nevada</text>
      <text x="10" y="477" font-family="Arial" font-size="16">Arizona</text>
      <text x="10" y="501" font-family="Arial" font-size="16">Long Beach St</text>

      <!-- ***** ROUND 2 ***** -->
      <!-- Rectangles -->
      <rect x="210" y="68" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="210" y="92" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="210" y="188" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="210" y="212" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="210" y="308" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="210" y="332" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="210" y="428" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="210" y="452" width="140" height="24" fill="lightgrey" stroke="black"/>
      <!-- Team Labels -->
      <text x="215" y="86" font-family="Arial" font-size="16">${picks[8]}</text>
      <text x="215" y="110" font-family="Arial" font-size="16">${picks[9]}</text>
      <text x="215" y="206" font-family="Arial" font-size="16">${picks[10]}</text>
      <text x="215" y="230" font-family="Arial" font-size="16">${picks[11]}</text>
      <text x="215" y="326" font-family="Arial" font-size="16">${picks[12]}</text>
      <text x="215" y="350" font-family="Arial" font-size="16">${picks[13]}</text>
      <text x="215" y="446" font-family="Arial" font-size="16">${picks[14]}</text>
      <text x="215" y="470" font-family="Arial" font-size="16">${picks[15]}</text>
      <!-- Lines -->
      <path d="M 145,62 H 175 V 92 H 209" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 145,122 H 175 V 92 H 209" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 145,182 H 175 V 212 H 209" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 145,242 H 175 V 212 H 209" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 145,302 H 175 V 332 H 209" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 145,362 H 175 V 332 H 209" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 145,422 H 175 V 452 H 209" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 145,482 H 175 V 452 H 209" stroke="black" stroke-width="2" fill="none"/>

      <!-- ***** ROUND 3 ***** -->
      <!-- Rectangles -->
      <rect x="415" y="130" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="415" y="154" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="415" y="370" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="415" y="394" width="140" height="24" fill="lightgrey" stroke="black"/>
      <!-- Team Labels -->
      <text x="420" y="148" font-family="Arial" font-size="16">${picks[36]}</text>
      <text x="420" y="172" font-family="Arial" font-size="16">${picks[37]}</text>
      <text x="420" y="388" font-family="Arial" font-size="16">${picks[38]}</text>
      <text x="420" y="412" font-family="Arial" font-size="16">${picks[39]}</text>
      <!-- Lines -->
      <path d="M 350,92 H 380 V 154 H 415" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 350,212 H 380 V 154 H 415" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 350,332 H 380 V 394 H 415" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 350,452 H 380 V 394 H 415" stroke="black" stroke-width="2" fill="none"/>

      <!-- ***** ROUND 4 ***** -->
      <!-- Rectangles -->
      <rect x="630" y="248" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="630" y="272" width="140" height="24" fill="lightgrey" stroke="black"/>
      <!-- Team Labels -->
      <text x="635" y="266" font-family="Arial" font-size="16">${picks[50]}</text>
      <text x="635" y="290" font-family="Arial" font-size="16">${picks[51]}</text>
      <!-- Lines -->
      <path d="M 555,154 H 585 V 272 H 630" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 555,394 H 585 V 272 H 630" stroke="black" stroke-width="2" fill="none"/>
  </svg>
  `

  const svgContentSouth: string = `
    <svg viewBox='0 0 800 550' xmlns="http://www.w3.org/2000/svg">
      <!-- ********** SOUTH ********** -->

      <!-- ***** ROUND 1 ***** -->
      <!-- Rectangles -->
      <rect x="650" y="38" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="62" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="98" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="122" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="158" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="182" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="218" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="242" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="278" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="302" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="338" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="362" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="398" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="422" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="458" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="482" width="140" height="24" fill="lightgrey" stroke="black"/>
      <!-- Team Labels -->
      <text x="655" y="57" font-family="Arial" font-size="16">Houston</text>
      <text x="655" y="81" font-family="Arial" font-size="16">Longwood</text>
      <text x="655" y="117" font-family="Arial" font-size="16">Nebraska</text>
      <text x="655" y="141" font-family="Arial" font-size="16">Texas A and M</text>
      <text x="655" y="177" font-family="Arial" font-size="16">Wisonsin</text>
      <text x="655" y="201" font-family="Arial" font-size="16">James Madison</text>
      <text x="655" y="237" font-family="Arial" font-size="16">Duke</text>
      <text x="655" y="261" font-family="Arial" font-size="16">Vermont</text>
      <text x="655" y="297" font-family="Arial" font-size="16">Texas Tech</text>
      <text x="655" y="321" font-family="Arial" font-size="16">NC State</text>
      <text x="655" y="357" font-family="Arial" font-size="16">Kentucky</text>
      <text x="655" y="381" font-family="Arial" font-size="16">Oakland</text>
      <text x="655" y="417" font-family="Arial" font-size="16">Florida</text>
      <text x="655" y="441" font-family="Arial" font-size="16">Boise St/Colorado</text>
      <text x="655" y="477" font-family="Arial" font-size="16">Marquette</text>
      <text x="655" y="501" font-family="Arial" font-size="16">Western Kentucky</text>

      <!-- ***** ROUND 2 ***** -->
      <!-- Rectangles -->
      <rect x="435" y="68" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="435" y="92" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="435" y="188" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="435" y="212" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="435" y="308" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="435" y="332" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="435" y="428" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="435" y="452" width="140" height="24" fill="lightgrey" stroke="black"/>
      <!-- Team Labels -->
      <text x="440" y="86" font-family="Arial" font-size="16">${picks[16]}</text>
      <text x="440" y="110" font-family="Arial" font-size="16">${picks[17]}</text>
      <text x="440" y="206" font-family="Arial" font-size="16">${picks[18]}</text>
      <text x="440" y="230" font-family="Arial" font-size="16">${picks[19]}</text>
      <text x="440" y="326" font-family="Arial" font-size="16">${picks[20]}</text>
      <text x="440" y="350" font-family="Arial" font-size="16">${picks[21]}</text>
      <text x="440" y="446" font-family="Arial" font-size="16">${picks[22]}</text>
      <text x="440" y="470" font-family="Arial" font-size="16">${picks[23]}</text>
      <!-- Lines -->
      <path d="M 650,62 H 620 V 92 H 575" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 650,122 H 620 V 92 H 575" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 650,182 H 620 V 212 H 575" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 650,242 H 620 V 212 H 575" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 650,302 H 620 V 332 H 575" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 650,362 H 620 V 332 H 575" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 650,422 H 620 V 452 H 575" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 650,482 H 620 V 452 H 575" stroke="black" stroke-width="2" fill="none"/>

      <!-- ***** ROUND 3 ***** -->
      <!-- Rectangles -->
      <rect x="220" y="130" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="220" y="154" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="220" y="370" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="220" y="394" width="140" height="24" fill="lightgrey" stroke="black"/>
      <!-- Team Labels -->
      <text x="225" y="148" font-family="Arial" font-size="16">${picks[40]}</text>
      <text x="225" y="172" font-family="Arial" font-size="16">${picks[41]}</text>
      <text x="225" y="388" font-family="Arial" font-size="16">${picks[42]}</text>
      <text x="225" y="412" font-family="Arial" font-size="16">${picks[43]}</text>
      <!-- Lines -->
      <path d="M 435,92 H 405 V 154 H 361" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 435,212 H 405 V 154 H 361" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 435,332 H 405 V 394 H 361" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 435,452 H 405 V 394 H 361" stroke="black" stroke-width="2" fill="none"/>
      
      <!-- ***** ROUND 4 ***** -->
      <!-- Rectangles -->
      <rect x="5" y="248" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="272" width="140" height="24" fill="lightgrey" stroke="black"/>
      <!-- Team Labels -->
      <text x="10" y="266" font-family="Arial" font-size="16">${picks[52]}</text>
      <text x="10" y="290" font-family="Arial" font-size="16">${picks[53]}</text>
      <!-- Lines -->
      <path d="M 220,154 H 190 V 272 H 145" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 220,394 H 190 V 272 H 145" stroke="black" stroke-width="2" fill="none"/>
    </svg>
  `

  const svgContentMidwest: string = `
    <svg viewBox='0 0 800 550' xmlns="http://www.w3.org/2000/svg">
      <!-- ********** MIDWEST ********** -->

      <!-- ***** ROUND 1 ***** -->  
      <!-- Rectangles -->
      <rect x="650" y="38" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="62" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="98" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="122" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="158" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="182" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="218" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="242" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="278" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="302" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="338" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="362" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="398" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="422" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="458" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="650" y="482" width="140" height="24" fill="lightgrey" stroke="black"/>
      <!-- Team Labels -->
      <text x="655" y="57" font-family="Arial" font-size="16">Kansas</text>
      <text x="655" y="81" font-family="Arial" font-size="16">Oregon</text>
      <text x="655" y="117" font-family="Arial" font-size="16">Iowa</text>
      <text x="655" y="141" font-family="Arial" font-size="16">Florida</text>
      <text x="655" y="177" font-family="Arial" font-size="16">Gonzaga</text>
      <text x="655" y="201" font-family="Arial" font-size="16">Pittsburgh</text>
      <text x="655" y="237" font-family="Arial" font-size="16">Portland St</text>
      <text x="655" y="261" font-family="Arial" font-size="16">UCLA</text>
      <text x="655" y="297" font-family="Arial" font-size="16">Team9</text>
      <text x="655" y="321" font-family="Arial" font-size="16">Team10</text>
      <text x="655" y="357" font-family="Arial" font-size="16">Team11</text>
      <text x="655" y="381" font-family="Arial" font-size="16">Team12</text>
      <text x="655" y="417" font-family="Arial" font-size="16">Team13</text>
      <text x="655" y="441" font-family="Arial" font-size="16">Team14</text>
      <text x="655" y="477" font-family="Arial" font-size="16">Team15</text>
      <text x="655" y="501" font-family="Arial" font-size="16">Team16</text>

      <!-- ***** ROUND 2 ***** -->
      <!-- Rectangles -->
      <rect x="435" y="68" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="435" y="92" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="435" y="188" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="435" y="212" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="435" y="308" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="435" y="332" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="435" y="428" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="435" y="452" width="140" height="24" fill="lightgrey" stroke="black"/>
      <!-- Team Labels -->
      <text x="440" y="86" font-family="Arial" font-size="16">Oregon</text>
      <text x="440" y="110" font-family="Arial" font-size="16">Iowa</text>
      <text x="440" y="206" font-family="Arial" font-size="16">Gonzaga</text>
      <text x="440" y="230" font-family="Arial" font-size="16">UCLA</text>
      <text x="440" y="326" font-family="Arial" font-size="16">Oregon</text>
      <text x="440" y="350" font-family="Arial" font-size="16">Iowa</text>
      <text x="440" y="446" font-family="Arial" font-size="16">Gonzaga</text>
      <text x="440" y="470" font-family="Arial" font-size="16">UCLA</text>
      <!-- Lines -->
      <path d="M 650,62 H 620 V 92 H 575" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 650,122 H 620 V 92 H 575" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 650,182 H 620 V 212 H 575" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 650,242 H 620 V 212 H 575" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 650,302 H 620 V 332 H 575" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 650,362 H 620 V 332 H 575" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 650,422 H 620 V 452 H 575" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 650,482 H 620 V 452 H 575" stroke="black" stroke-width="2" fill="none"/>

      <!-- ***** ROUND 3 ***** -->
      <!-- Rectangles -->
      <rect x="220" y="130" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="220" y="154" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="220" y="370" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="220" y="394" width="140" height="24" fill="lightgrey" stroke="black"/>
      <!-- Team Labels -->
      <text x="225" y="148" font-family="Arial" font-size="16">Oregon</text>
      <text x="225" y="172" font-family="Arial" font-size="16">UCLA</text>
      <text x="225" y="388" font-family="Arial" font-size="16">Oregon</text>
      <text x="225" y="412" font-family="Arial" font-size="16">UCLA</text>
      <!-- Lines -->
      <path d="M 435,92 H 405 V 154 H 361" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 435,212 H 405 V 154 H 361" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 435,332 H 405 V 394 H 361" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 435,452 H 405 V 394 H 361" stroke="black" stroke-width="2" fill="none"/>

      <!-- ***** ROUND 4 ***** -->
      <!-- Rectangles -->
      <rect x="5" y="248" width="140" height="24" fill="lightgrey" stroke="black"/>
      <rect x="5" y="272" width="140" height="24" fill="lightgrey" stroke="black"/>
      <!-- Team Labels -->
      <text x="10" y="266" font-family="Arial" font-size="16">Oregon</text>
      <text x="10" y="290" font-family="Arial" font-size="16">UCLA</text>
      <!-- Lines -->
      <path d="M 220,154 H 190 V 272 H 145" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 220,394 H 190 V 272 H 145" stroke="black" stroke-width="2" fill="none"/>
    </svg>
  `

  //const svgDataUrl: string = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent)))}`;
  //console.log('svgDataUrl', svgDataUrl);


  // Define the dimensions based on the 1.91:1 aspect ratio
  const originalHeightSize = 550;
  const originalWidthSize = 800;
  const newWidth = originalWidthSize * 1.91; 
  const centerX = newWidth / 2;
  const clipStartX = centerX - 400; // Start of the clip rectangle

  let svgContent = '';
  if (currentPage === 'EAST') { 
    svgContent = svgContentEast;
   } else if (currentPage === 'WEST') {
    svgContent = svgContentWest;
   } else if (currentPage === 'SOUTH') {
    svgContent = svgContentSouth;
  } else if (currentPage === 'MIDWEST') {
    svgContent = svgContentMidwest;
   }

  // Create the new SVG string and add a clipPath to clip the contents
  const framedSvgString = `
     <svg width="${newWidth}" height="${originalHeightSize}" viewBox="0 0 ${newWidth} ${originalHeightSize}" xmlns="http://www.w3.org/2000/svg">
       <defs>
         <clipPath id="clip">
           <!-- Set the clipping rectangle to start at clipStartX and be 1024 units wide -->
           <rect x="${clipStartX}" width="800" height="${originalHeightSize}" />
         </clipPath>
       </defs>
       <g clip-path="url(#clip)">
         ${svgContent}
       </g>
     </svg>
   `;

   const svgDataUrl: string = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(framedSvgString)))}`;


  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: '<<',
        },
        {
          label: '>>',
        },
      ],
      image: {
        src: svgDataUrl,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/cat`,
    }),
  );
}

/*
async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();

  let tokenId: bigint = 371n;

  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  console.log('FLAG 1');

  const picks = await publicClient.readContract({
    address: PICK_ONCHAIN_CONTRACT_ADDR,
    abi: PickOnchainABI,
    functionName: 'ViewPickByTokenID',
    args: [tokenId],
  })// as Player[];

  console.log('FLAG 2');
  console.log('FLAG 3');
  console.log('publicClient', publicClient);
  console.log('picks', picks);
  console.log('FLAG 4');

  return NextResponse.json(picks);

}
*/

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
