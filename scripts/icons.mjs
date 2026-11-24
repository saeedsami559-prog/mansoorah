// Generates favicon.ico, apple-touch-icon and PWA icons from public/brand/mark.svg.
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const svg = await readFile('public/brand/mark.svg');
const png = (size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();

await writeFile('public/brand/icon-192.png', await png(192));
await writeFile('public/brand/icon-512.png', await png(512));
await writeFile('public/brand/apple-touch-icon.png', await png(180));

// Maskable: mark on a full-bleed square with safe-zone padding.
const inner = await png(380);
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#1C5AA6' } })
  .composite([{ input: inner, top: 66, left: 66 }])
  .png()
  .toFile('public/brand/icon-maskable-512.png');

// favicon.ico containing a 32×32 PNG (PNG-in-ICO is supported by all current browsers).
const ico32 = await png(32);
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
const entry = Buffer.alloc(16);
entry.writeUInt8(32, 0);
entry.writeUInt8(32, 1);
entry.writeUInt8(0, 2);
entry.writeUInt8(0, 3);
entry.writeUInt16LE(1, 4);
entry.writeUInt16LE(32, 6);
entry.writeUInt32LE(ico32.length, 8);
entry.writeUInt32LE(22, 12);
await writeFile('public/favicon.ico', Buffer.concat([header, entry, ico32]));
console.log('icons written');
