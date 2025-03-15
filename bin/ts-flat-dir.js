#!/usr/bin/env node
import { resolve, basename } from 'node:path';
import { access, mkdir } from 'node:fs/promises';
import { glob } from 'fast-glob';
import { flat } from '../build/index.js';

const globPattern = process.argv[2];
if (typeof globPattern !== 'string') {
  console.error(`Glob pattern is not provided`);
  process.exit(1);
}

const outputDir = (() => {
  try {
    return resolve(process.argv[3]);
  } catch (e) {
    console.error(`Output directory is not provided`);
    process.exit(1);
  }
})();

await mkdir(outputDir, { recursive: true });

const files = await glob(globPattern, { dot: true });

await Promise.all(
  files
    .map(async (file) => {
      const inputBasename = basename(file);
      const outputFilename = resolve(outputDir, inputBasename);
      if(false !== await access(outputFilename).catch(() => false)) {
        console.error(`Filename ${outputFilename} already exists`);
      }
      await flat(file, outputFilename);
    })
).catch(e => {
  console.error(e);
  process.exit(1);
});
