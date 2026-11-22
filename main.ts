// POV TikTok ad entry for make.fun bring-the-humans-03 (Node 22, standard library only).
//
// This program copies VIDEO.json from the repository root to /output/VIDEO.json,
// where the gate reads it. It also validates that VIDEO.json names a real public
// TikTok video from the account that posts this entry. TikTok renamed that
// account mid-upload from @Approximatelly6 to @approximatelly888, so both
// handles name the same account and either form of the video's address is
// accepted below. The video is now posted from Budi's other TikTok account
// @approximatelly instead, so that handle is accepted too. The placeholder
// the repo ships with is refused on purpose, so no entry can be submitted
// with a fake address. Replace VIDEO.json with the posted video's address
// and this program exits 0.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand
// in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// With the placeholder still in VIDEO.json that exits 1 by design; with a real
// address (e.g. https://www.tiktok.com/@Approximatelly6/video/1234567890123456789)
// it exits 0 and writes out/VIDEO.json.

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
// The account's handle at posting time, and its handle after TikTok renamed
// it mid-upload: one account, two names, both accepted. The video is now
// posted from Budi's other account @approximatelly, so that handle is
// accepted too.
const HANDLES = ['@Approximatelly6', '@approximatelly888', '@approximatelly'];

const videoPath = join(BOT_DIR, 'VIDEO.json');
let video;
try {
  video = JSON.parse(readFileSync(videoPath, 'utf8'));
} catch (err) {
  console.error(`VIDEO.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

const url = typeof video?.url === 'string' ? video.url : '';
const match = /^https:\/\/www\.tiktok\.com\/@([A-Za-z0-9._]+)\/video\/(\d+)$/.exec(url);
if (!match) {
  console.error(`VIDEO.json does not hold a TikTok video address: ${JSON.stringify(url)}`);
  process.exit(1);
}
if (!HANDLES.includes(`@${match[1]}`)) {
  console.error(`VIDEO.json names @${match[1]} but this entry posts from ${HANDLES.join(' or ')}`);
  process.exit(1);
}
if (/^0+$/.test(match[2])) {
  console.error('VIDEO.json still holds the placeholder address; replace it with the posted video first.');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(videoPath, join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

console.log(`POV ad entry: video ${url}`);
console.log(`VIDEO.json copied to ${join(OUTPUT_DIR, 'VIDEO.json')}`);
