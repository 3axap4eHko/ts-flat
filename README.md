# TS Flat

Flattens a TypeScript project into a single output file by inlining the contents of all imported modules. Useful for creating single-file distributions, analyzing dependencies, or preparing code for environments that require a single file.

## Installation

```bash
npm install -g ts-flat
# or
npm install --save-dev ts-flat
```

## Usage

### CLI Commands

**Single file flattening:**
```bash
ts-flat src/index.ts dist/output.ts
```

**Multiple files with glob patterns:**
```bash
ts-flat-dir "src/**/*.ts" "!src/**/*.test.ts" dist/
```

### Programmatic API

```typescript
import { flat } from 'ts-flat';

const flattened = await flat('src/index.ts');
// Returns the flattened code as a string
```

## How It Works

1. Parses your entry file using SWC's TypeScript parser
2. Recursively follows and inlines all local imports
3. Removes import statements and converts exports to regular declarations
4. Orders dependencies correctly to maintain execution order
5. Outputs a single concatenated file

## Limitations

- **TypeScript only**: All imported modules must be TypeScript files (`.ts`, `.mts`, `.cts`, `.tsx`)
- **Named exports only**: Only handles named export declarations (not `export default` or `export * from`)
- **Local imports only**: External package imports are not processed
- **ESM imports required**: Uses explicit file paths as per ESM specification (no directory imports)


## License

License [The MIT License](http://opensource.org/licenses/MIT)
Copyright (c) 2025 Ivan Zakharchanka

