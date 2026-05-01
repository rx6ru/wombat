import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { generateOpenApiDocument } from './index.js';

const outputPath = resolve(process.cwd(), 'docs/openapi.json');
const document = generateOpenApiDocument();

writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
console.log(`OpenAPI document written to ${outputPath}`);
