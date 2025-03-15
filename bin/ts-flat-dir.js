#!/usr/bin/env node
import { resolve, basename } from 'node:path';
import { access, mkdir, copyFile } from 'node:fs/promises';
import FastGlob from 'fast-glob';
import { flat } from '../build/index.js';

const { glob } = FastGlob;

const patterns = process.argv.slice(2, -1);
if (!patterns.every(pattern => typeof pattern === 'string')) {
  console.error(`Glob patterns are not provided`);
  process.exit(1);
}

const outputDir = (() => {
  try {
    return resolve(process.argv.slice(-1).pop());
  } catch (e) {
    console.error(`Output directory is not provided`);
    process.exit(1);
  }
})();

await mkdir(outputDir, { recursive: true });

const files = await Promise.all(patterns.map(pattern => glob(pattern, { absolute: true, dot: true })));
const uniqueFiles = [...new Set(files.flat())];

await Promise.all(
  uniqueFiles
    .map(async (file) => {
      const inputBasename = basename(file);
      const outputFilename = resolve(outputDir, inputBasename);
      if(false !== await access(outputFilename).catch(() => false)) {
        console.error(`Filename ${outputFilename} already exists`);
      }
      if (outputFilename.endsWith('.d.ts')) {
        await copyFile(file, outputFilename);
      } else {
        await flat(file, outputFilename);
      }
    })
).catch(e => {
  console.error(e);
  process.exit(1);
});
