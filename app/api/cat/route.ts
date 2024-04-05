import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { encodeFunctionData, parseEther } from 'viem';
import { base } from 'viem/chains';
import PickOnchainABI from '../../_contracts/PickOnchainABI';
import { PICK_ONCHAIN_CONTRACT_ADDR } from '../../config';
import type { FrameTransactionResponse } from '@coinbase/onchainkit/frame';
import { createPublicClient, http } from 'viem';

function isEliminated(pick: string): boolean {
  console.log('isEliminated pick', pick);
  // Final Four
  if (pick === winners[56] && winners[60] === '') { return false; }
  if (pick === winners[57] && winners[60] === '') { return false; }
  if (pick === winners[58] && winners[61] === '') { return false; }
  if (pick === winners[59] && winners[61] === '') { return false; }
  // Championship
  if (pick === winners[60] && winners[62] === '') { return false; }
  if (pick === winners[61] && winners[62] === '') { return false; }
  // Champion
  if (pick === winners[62]) { return false; }

  return true;
}

function getColor(pick: string, index: number): string {
  if (winners[index] === '') {
    if (isEliminated(pick)) {
      return "pink";
    }
    return "lightgrey";
  }
  if (winners[index] === pick) {
    return "lightgreen";
  }
  return "pink";
}

let getPicks = false;
let currentPage = 'EAST';
let picks: string[] = [];
let currentTokenId = BigInt(0);
const winners = [
  // EAST - ROUND 1
  'UConn',
  'Northwestern',
  'San Diego St.',
  'Yale',
  'Duquesne',
  'Illinois',
  'Washington St.',
  'Iowa St.',
  // WEST - ROUND 1
  'North Carolina',
  'Michigan St.',
  'Grand Canyon.',
  'Alabama',
  'Clemson',
  'Baylor',
  'Dayton',
  'Arizona',
  // SOUTH - ROUND 1
  'Houston',
  'Texas AM',
  'James Madison',
  'Duke',
  'NC State',
  'Oakland',
  'Colorado',
  'Marquette',
  // MIDWEST - ROUND 1
  'Purdue',
  'Utah St.',
  'Gonzaga',
  'Kansas',
  'Oregon',
  'Creighton',
  'Texas',
  'Tennessee',
  // EAST - ROUND 2
  'UConn',
  'San Diego St.',
  'Illinois',
  'Iowa St.',
  // WEST - ROUND 2
  'North Carolina',
  'Alabama',
  'Clemson',
  'Arizona',
  // SOUTH - ROUND 2
  'Houston',
  'Duke',
  'NC State',
  'Marquette',
  // MIDWEST - ROUND 2
  'Purdue',
  'Gonzaga',
  'Creighton',
  'Tennessee',
  // EAST - ROUND 3
  'UConn',
  'Illinois',
  // WEST - ROUND 3
  'Alabama',
  'Clemson',
  // SOUTH - ROUND 3
  'Duke',
  'NC State',
  // MIDWEST - ROUND 3
  'Purdue',
  'Tennessee',
  // FINAL FOUR
  'UConn',
  'Alabama',
  'NC State',
  'Purdue',
  // FINAL
  '',
  '',
  // CHAMPION
  ''
];

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  console.log('message', message);
  console.log('currentTokenId', currentTokenId);
  console.log('message.input', message.input);

  const inputTokenId = message.input;
  let tokenId = BigInt(1);

  if (typeof inputTokenId === 'undefined') {
    if (currentTokenId === BigInt(0)) {
      tokenId = BigInt(1);
    } else {
      tokenId = currentTokenId;
    }
  } else {
    tokenId = BigInt(inputTokenId);
  }

  // Set currentPage
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

  if (currentTokenId !== tokenId) {
    // Initialize
    currentTokenId = tokenId;
    getPicks = false;
    currentPage = 'EAST';
  }

  console.log('tokenId', tokenId);
  console.log('message?.button', message?.button);
  console.log('currentPage', currentPage);

  // Get picks
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

    const cleanedTeams = contractPicks.map(pick => pick.split('#')[0].trim());
    picks = cleanedTeams as string[];
    console.log('picks', picks);
    getPicks = true;
  }
  // END Get Picks

  const svgContentEast: string = `
    <svg viewBox='0 0 800 550' xmlns="http://www.w3.org/2000/svg">
      <!-- ********** EAST ********** -->
      <!-- Title -->
      <text x="650" y="66" font-family="Arial" font-size="46" fill="blue">EAST</text>
      <text x="650" y="126" font-family="Arial" font-size="36" fill="blue">#${tokenId}</text>

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
      <text x="10" y="57" font-family="Arial" font-size="16">UConn</text>
      <text x="10" y="81" font-family="Arial" font-size="16">Stetson</text>
      <text x="10" y="117" font-family="Arial" font-size="16">Florida Atlantic</text>
      <text x="10" y="141" font-family="Arial" font-size="16">Northwestern</text>
      <text x="10" y="177" font-family="Arial" font-size="16">San Diego St.</text>
      <text x="10" y="201" font-family="Arial" font-size="16">UAB</text>
      <text x="10" y="237" font-family="Arial" font-size="16">Auburn</text>
      <text x="10" y="261" font-family="Arial" font-size="16">Yale</text>
      <text x="10" y="297" font-family="Arial" font-size="16">BYU</text>
      <text x="10" y="321" font-family="Arial" font-size="16">Duquesne</text>
      <text x="10" y="357" font-family="Arial" font-size="16">Illinois</text>
      <text x="10" y="381" font-family="Arial" font-size="16">Morehead St.</text>
      <text x="10" y="417" font-family="Arial" font-size="16">Washington St.</text>
      <text x="10" y="441" font-family="Arial" font-size="16">Drake</text>
      <text x="10" y="477" font-family="Arial" font-size="16">Iowa St.</text>
      <text x="10" y="501" font-family="Arial" font-size="16">S. Dakota St.</text>

      <!-- ***** ROUND 2 ***** -->
      <!-- Rectangles -->
      <rect x="210" y="68" width="140" height="24" fill="${getColor(picks[0], 0)}" stroke="black"/>
      <rect x="210" y="92" width="140" height="24" fill="${getColor(picks[1], 1)}" stroke="black"/>
      <rect x="210" y="188" width="140" height="24" fill="${getColor(picks[2], 2)}" stroke="black"/>
      <rect x="210" y="212" width="140" height="24" fill="${getColor(picks[3], 3)}" stroke="black"/>
      <rect x="210" y="308" width="140" height="24" fill="${getColor(picks[4], 4)}" stroke="black"/>
      <rect x="210" y="332" width="140" height="24" fill="${getColor(picks[5], 5)}" stroke="black"/>
      <rect x="210" y="428" width="140" height="24" fill="${getColor(picks[6], 6)}" stroke="black"/>
      <rect x="210" y="452" width="140" height="24" fill="${getColor(picks[7], 7)}" stroke="black"/>
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
      <rect x="415" y="130" width="140" height="24" fill="${getColor(picks[32], 32)}" stroke="black"/>
      <rect x="415" y="154" width="140" height="24" fill="${getColor(picks[33], 33)}" stroke="black"/>
      <rect x="415" y="370" width="140" height="24" fill="${getColor(picks[34], 34)}" stroke="black"/>
      <rect x="415" y="394" width="140" height="24" fill="${getColor(picks[35], 35)}" stroke="black"/>
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
      <rect x="630" y="248" width="140" height="24" fill="${getColor(picks[48], 48)}" stroke="black"/>
      <rect x="630" y="272" width="140" height="24" fill="${getColor(picks[49], 49)}" stroke="black"/>
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
      <!-- Title -->
      <text x="650" y="66" font-family="Arial" font-size="46" fill="blue">WEST</text>
      <text x="650" y="126" font-family="Arial" font-size="36" fill="blue">#${tokenId}</text>

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
      <text x="10" y="81" font-family="Arial" font-size="16">Howard/Wagner</text>
      <text x="10" y="117" font-family="Arial" font-size="16">Mississippi St.</text>
      <text x="10" y="141" font-family="Arial" font-size="16">Michigan St.</text>
      <text x="10" y="177" font-family="Arial" font-size="16">Saint Marys</text>
      <text x="10" y="201" font-family="Arial" font-size="16">Grand Canyon.</text>
      <text x="10" y="237" font-family="Arial" font-size="16">Alabama</text>
      <text x="10" y="261" font-family="Arial" font-size="16">Charleston</text>
      <text x="10" y="297" font-family="Arial" font-size="16">Clemson</text>
      <text x="10" y="321" font-family="Arial" font-size="16">New Mexico</text>
      <text x="10" y="357" font-family="Arial" font-size="16">Baylor</text>
      <text x="10" y="381" font-family="Arial" font-size="16">Colgate</text>
      <text x="10" y="417" font-family="Arial" font-size="16">Dayton</text>
      <text x="10" y="441" font-family="Arial" font-size="16">Nevada</text>
      <text x="10" y="477" font-family="Arial" font-size="16">Arizona</text>
      <text x="10" y="501" font-family="Arial" font-size="16">Long Beach St.</text>

      <!-- ***** ROUND 2 ***** -->
      <!-- Rectangles -->
      <rect x="210" y="68" width="140" height="24" fill="${getColor(picks[8], 8)}" stroke="black"/>
      <rect x="210" y="92" width="140" height="24" fill="${getColor(picks[9], 9)}" stroke="black"/>
      <rect x="210" y="188" width="140" height="24" fill="${getColor(picks[10], 10)}" stroke="black"/>
      <rect x="210" y="212" width="140" height="24" fill="${getColor(picks[11], 11)}" stroke="black"/>
      <rect x="210" y="308" width="140" height="24" fill="${getColor(picks[12], 12)}" stroke="black"/>
      <rect x="210" y="332" width="140" height="24" fill="${getColor(picks[13], 13)}" stroke="black"/>
      <rect x="210" y="428" width="140" height="24" fill="${getColor(picks[14], 14)}" stroke="black"/>
      <rect x="210" y="452" width="140" height="24" fill="${getColor(picks[15], 15)}" stroke="black"/>
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
      <rect x="415" y="130" width="140" height="24" fill="${getColor(picks[36], 36)}" stroke="black"/>
      <rect x="415" y="154" width="140" height="24" fill="${getColor(picks[37], 37)}" stroke="black"/>
      <rect x="415" y="370" width="140" height="24" fill="${getColor(picks[38], 38)}" stroke="black"/>
      <rect x="415" y="394" width="140" height="24" fill="${getColor(picks[39], 39)}" stroke="black"/>
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
      <rect x="630" y="248" width="140" height="24" fill="${getColor(picks[50], 50)}" stroke="black"/>
      <rect x="630" y="272" width="140" height="24" fill="${getColor(picks[51], 51)}" stroke="black"/>
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
      <!-- Title -->
      <text x="5" y="66" font-family="Arial" font-size="46" fill="blue">SOUTH</text>
      <text x="5" y="126" font-family="Arial" font-size="36" fill="blue">#${tokenId}</text>

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
      <text x="655" y="141" font-family="Arial" font-size="16">Texas A&amp;M</text>
      <text x="655" y="177" font-family="Arial" font-size="16">Wisonsin</text>
      <text x="655" y="201" font-family="Arial" font-size="16">James Madison</text>
      <text x="655" y="237" font-family="Arial" font-size="16">Duke</text>
      <text x="655" y="261" font-family="Arial" font-size="16">Vermont</text>
      <text x="655" y="297" font-family="Arial" font-size="16">Texas Tech</text>
      <text x="655" y="321" font-family="Arial" font-size="16">NC State</text>
      <text x="655" y="357" font-family="Arial" font-size="16">Kentucky</text>
      <text x="655" y="381" font-family="Arial" font-size="16">Oakland</text>
      <text x="655" y="417" font-family="Arial" font-size="16">Florida</text>
      <text x="655" y="441" font-family="Arial" font-size="16">Boise St./Colorado</text>
      <text x="655" y="477" font-family="Arial" font-size="16">Marquette</text>
      <text x="655" y="501" font-family="Arial" font-size="16">W. Kentucky</text>

      <!-- ***** ROUND 2 ***** -->
      <!-- Rectangles -->
      <rect x="435" y="68" width="140" height="24" fill="${getColor(picks[16], 16)}" stroke="black"/>
      <rect x="435" y="92" width="140" height="24" fill="${getColor(picks[17], 17)}" stroke="black"/>
      <rect x="435" y="188" width="140" height="24" fill="${getColor(picks[18], 18)}" stroke="black"/>
      <rect x="435" y="212" width="140" height="24" fill="${getColor(picks[19], 19)}" stroke="black"/>
      <rect x="435" y="308" width="140" height="24" fill="${getColor(picks[20], 20)}" stroke="black"/>
      <rect x="435" y="332" width="140" height="24" fill="${getColor(picks[21], 21)}" stroke="black"/>
      <rect x="435" y="428" width="140" height="24" fill="${getColor(picks[22], 22)}" stroke="black"/>
      <rect x="435" y="452" width="140" height="24" fill="${getColor(picks[23], 23)}" stroke="black"/>
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
      <rect x="220" y="130" width="140" height="24" fill="${getColor(picks[40], 40)}" stroke="black"/>
      <rect x="220" y="154" width="140" height="24" fill="${getColor(picks[41], 41)}" stroke="black"/>
      <rect x="220" y="370" width="140" height="24" fill="${getColor(picks[42], 42)}" stroke="black"/>
      <rect x="220" y="394" width="140" height="24" fill="${getColor(picks[43], 43)}" stroke="black"/>
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
      <rect x="5" y="248" width="140" height="24" fill="${getColor(picks[52], 52)}" stroke="black"/>
      <rect x="5" y="272" width="140" height="24" fill="${getColor(picks[53], 53)}" stroke="black"/>
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
      <!-- Title -->
      <text x="5" y="66" font-family="Arial" font-size="46" fill="blue">MIDWEST</text>
      <text x="5" y="126" font-family="Arial" font-size="36" fill="blue">#${tokenId}</text>

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
      <text x="655" y="57" font-family="Arial" font-size="16">Purdue</text>
      <text x="655" y="81" font-family="Arial" font-size="16">Grambling St.</text>
      <text x="655" y="117" font-family="Arial" font-size="16">Utah St.</text>
      <text x="655" y="141" font-family="Arial" font-size="16">TCU</text>
      <text x="655" y="177" font-family="Arial" font-size="16">Gonzaga</text>
      <text x="655" y="201" font-family="Arial" font-size="16">McNeese</text>
      <text x="655" y="237" font-family="Arial" font-size="16">Kansas</text>
      <text x="655" y="261" font-family="Arial" font-size="16">Samford</text>
      <text x="655" y="297" font-family="Arial" font-size="16">S. Carolina</text>
      <text x="655" y="321" font-family="Arial" font-size="16">Oregon</text>
      <text x="655" y="357" font-family="Arial" font-size="16">Creighton</text>
      <text x="655" y="381" font-family="Arial" font-size="16">Akron</text>
      <text x="655" y="417" font-family="Arial" font-size="16">Texas</text>
      <text x="655" y="441" font-family="Arial" font-size="16">Virgina/Colorado St.</text>
      <text x="655" y="477" font-family="Arial" font-size="16">Tennessee</text>
      <text x="655" y="501" font-family="Arial" font-size="16">Saint Peters</text>

      <!-- ***** ROUND 2 ***** -->
      <!-- Rectangles -->
      <rect x="435" y="68" width="140" height="24" fill="${getColor(picks[24], 24)}" stroke="black"/>
      <rect x="435" y="92" width="140" height="24" fill="${getColor(picks[25], 25)}" stroke="black"/>
      <rect x="435" y="188" width="140" height="24" fill="${getColor(picks[26], 26)}" stroke="black"/>
      <rect x="435" y="212" width="140" height="24" fill="${getColor(picks[27], 27)}" stroke="black"/>
      <rect x="435" y="308" width="140" height="24" fill="${getColor(picks[28], 28)}" stroke="black"/>
      <rect x="435" y="332" width="140" height="24" fill="${getColor(picks[29], 29)}" stroke="black"/>
      <rect x="435" y="428" width="140" height="24" fill="${getColor(picks[30], 30)}" stroke="black"/>
      <rect x="435" y="452" width="140" height="24" fill="${getColor(picks[31], 31)}" stroke="black"/>
      <!-- Team Labels -->
      <text x="440" y="86" font-family="Arial" font-size="16">${picks[24]}</text>
      <text x="440" y="110" font-family="Arial" font-size="16">${picks[25]}</text>
      <text x="440" y="206" font-family="Arial" font-size="16">${picks[26]}</text>
      <text x="440" y="230" font-family="Arial" font-size="16">${picks[27]}</text>
      <text x="440" y="326" font-family="Arial" font-size="16">${picks[28]}</text>
      <text x="440" y="350" font-family="Arial" font-size="16">${picks[29]}</text>
      <text x="440" y="446" font-family="Arial" font-size="16">${picks[30]}</text>
      <text x="440" y="470" font-family="Arial" font-size="16">${picks[31]}</text>
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
      <rect x="220" y="130" width="140" height="24" fill="${getColor(picks[44], 44)}" stroke="black"/>
      <rect x="220" y="154" width="140" height="24" fill="${getColor(picks[45], 45)}" stroke="black"/>
      <rect x="220" y="370" width="140" height="24" fill="${getColor(picks[46], 46)}" stroke="black"/>
      <rect x="220" y="394" width="140" height="24" fill="${getColor(picks[47], 47)}" stroke="black"/>
      <!-- Team Labels -->
      <text x="225" y="148" font-family="Arial" font-size="16">${picks[44]}</text>
      <text x="225" y="172" font-family="Arial" font-size="16">${picks[45]}</text>
      <text x="225" y="388" font-family="Arial" font-size="16">${picks[46]}</text>
      <text x="225" y="412" font-family="Arial" font-size="16">${picks[47]}</text>
      <!-- Lines -->
      <path d="M 435,92 H 405 V 154 H 361" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 435,212 H 405 V 154 H 361" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 435,332 H 405 V 394 H 361" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 435,452 H 405 V 394 H 361" stroke="black" stroke-width="2" fill="none"/>

      <!-- ***** ROUND 4 ***** -->
      <!-- Rectangles -->
      <rect x="5" y="248" width="140" height="24" fill="${getColor(picks[54], 54)}" stroke="black"/>
      <rect x="5" y="272" width="140" height="24" fill="${getColor(picks[55], 55)}" stroke="black"/>
      <!-- Team Labels -->
      <text x="10" y="266" font-family="Arial" font-size="16">${picks[54]}</text>
      <text x="10" y="290" font-family="Arial" font-size="16">${picks[55]}</text>
      <!-- Lines -->
      <path d="M 220,154 H 190 V 272 H 145" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 220,394 H 190 V 272 H 145" stroke="black" stroke-width="2" fill="none"/>
    </svg>
  `

  const svgContentFinalFour = `
    <svg viewBox='0 0 600 520' xmlns="http://www.w3.org/2000/svg">  <!-- ***** FINAL FOUR ***** -->
      <!-- Title -->
      <text x="250" y="66" font-family="Arial" font-size="46" fill="blue">FINAL FOUR</text>
      <text x="250" y="126" font-family="Arial" font-size="36" fill="blue">#${tokenId}</text>
      <!-- Rectangles -->
      <rect x="5" y="38" width="140" height="24" fill="${getColor(picks[56], 56)}" stroke="black"/>
      <rect x="5" y="62" width="140" height="24" fill="${getColor(picks[57], 57)}" stroke="black"/>
      <!-- Team Labels -->
      <text x="10" y="56" font-family="Arial" font-size="16">${picks[56]}</text>
      <text x="10" y="80" font-family="Arial" font-size="16">${picks[57]}</text>
      <!-- Rectangles -->
      <rect x="5" y="434" width="140" height="24" fill="${getColor(picks[58], 58)}" stroke="black"/>
      <rect x="5" y="458" width="140" height="24" fill="${getColor(picks[59], 59)}" stroke="black"/>
      <!-- Team Labels -->
      <text x="10" y="452" font-family="Arial" font-size="16">${picks[58]}</text>
      <text x="10" y="476" font-family="Arial" font-size="16">${picks[59]}</text>
      <!-- Rectangles -->
      <rect x="220" y="230" width="140" height="24" fill="${getColor(picks[60], 60)}" stroke="black"/>
      <rect x="220" y="254" width="140" height="24" fill="${getColor(picks[61], 61)}" stroke="black"/>
      <!-- Team Labels -->
      <text x="225" y="248" font-family="Arial" font-size="16">${picks[60]}</text>
      <text x="225" y="272" font-family="Arial" font-size="16">${picks[61]}</text>
      <!-- Lines -->
      <path d="M 145,62 H 180 V 254 H 220" stroke="black" stroke-width="2" fill="none"/>
      <path d="M 145,458 H 180 V 254 H 220" stroke="black" stroke-width="2" fill="none"/>
      <!-- Lines -->
      <line x1="361" y1="254" x2="455" y2="254" stroke="black" stroke-width="2" />
      <!-- ********** WINNER ********** -->
      <rect x="435" y="242" width="140" height="24" fill="${getColor(picks[62], 62)}" stroke="black"/>
      <text x="440" y="260" font-family="Arial" font-size="16">${picks[62]}</text>
    </svg>
  `

  // Define the dimensions based on the 1.91:1 aspect ratio
  let originalHeightSize = 550;
  let originalWidthSize = 800;
  let newWidth = originalWidthSize * 1.91; 
  let centerX = newWidth / 2;
  let clipStartX = centerX - 400; // Start of the clip rectangle

  if (currentPage === 'FINAL_FOUR') {
    let originalHeightSize = 520;
    let originalWidthSize = 600;
    let newWidth = originalWidthSize * 1.91; 
    let centerX = newWidth / 2;
    let clipStartX = centerX - 300; // Start of the clip rectangle
  }

  let svgContent = '';
  let previousPage = 'FINAL_FOUR';
  let nextPage = 'WEST';
  if (currentPage === 'EAST') { 
    svgContent = svgContentEast;
    previousPage = 'FINAL FOUR';
    nextPage = 'WEST';
   } else if (currentPage === 'WEST') {
    svgContent = svgContentWest;
    previousPage = 'EAST';
    nextPage = 'SOUTH';
   } else if (currentPage === 'SOUTH') {
    svgContent = svgContentSouth;
    previousPage = 'WEST';
    nextPage = 'MIDWEST';
  } else if (currentPage === 'MIDWEST') {
    svgContent = svgContentMidwest;
    previousPage = 'SOUTH';
    nextPage = 'FINAL FOUR';
  } else if (currentPage === 'FINAL_FOUR') {
    svgContent = svgContentFinalFour;
    previousPage = 'MIDWEST';
    nextPage = 'EAST';
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
          label: `<<  ${previousPage}`,
        },
        {
          label: `${nextPage}  >>`,
        },
        {
          label: 'GO BACK',
          target: `${NEXT_PUBLIC_URL}/api/main`,
        },
      ],
      image: {
        src: svgDataUrl,
      },
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
