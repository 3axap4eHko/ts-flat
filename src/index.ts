import { resolve, dirname } from 'node:path';
import { readFile } from 'node:fs/promises';
import { parse, print } from '@swc/core';
import type { Program, Statement } from '@swc/core';

export const flat = async (entryPoint: string) => {
  const astMap = new Map<string, Program>();
  const processQueue: string[] = [entryPoint];
  const priority = new Set<string>(processQueue);

  while (processQueue.length) {
    const filename = processQueue.shift();
    if (filename && !astMap.has(filename)) {
      const source = await readFile(filename, 'utf-8');
      const ast = await parse(source, { syntax: "typescript" });
      astMap.set(filename, ast);
      for (const [index, node] of ast.body.entries()) {
        if (node.type === 'ImportDeclaration') {
          const directory = dirname(filename);
          const importFilename = resolve(directory, node.source.value) + '.ts';
          if (!astMap.has(importFilename)) {
            processQueue.push(importFilename);
          }
          priority.delete(importFilename);
          priority.add(importFilename);
          ast.body[index] = {
            type: 'EmptyStatement',
            span: {
              start: 0,
              end: 0,
              ctxt: 0,
            }
          } satisfies Statement;
        } else if (node.type === 'ExportDeclaration') {
          ast.body[index] = node.declaration;
        }
      }
    }
  }

  const scripts: string[] = [];

  for (const filename of priority) {
    const ast = astMap.get(filename)!;
    const { code } = await print(ast);
    scripts.unshift(code);
  }

  return scripts.join('\n').replace(/\n;/g, '');
}
