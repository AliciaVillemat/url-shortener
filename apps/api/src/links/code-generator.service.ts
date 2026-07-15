import { Injectable } from '@nestjs/common';
import { randomInt } from 'node:crypto';

export const LINK_CODE_LENGTH = 7;

const BASE62_ALPHABET =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

@Injectable()
export class CodeGeneratorService {
  generate(): string {
    return Array.from(
      { length: LINK_CODE_LENGTH },
      () => BASE62_ALPHABET[randomInt(BASE62_ALPHABET.length)],
    ).join('');
  }
}
