#!/usr/bin/env node
import { resolve } from 'node:path';
import { flat } from '../build/index.js';

const entryPoint = resolve(process.argv[2]);
const outputFile = resolve(process.argv[3]);

flat(entryPoint, outputFile);
