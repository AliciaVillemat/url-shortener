import { IsIn, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

import { EXPIRATION_PRESETS, type ExpirationPreset } from '../links.types';

export class CreateLinkDto {
  @IsString()
  @IsNotEmpty()
  url!: string;

  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsIn(EXPIRATION_PRESETS)
  expiration?: ExpirationPreset;
}
