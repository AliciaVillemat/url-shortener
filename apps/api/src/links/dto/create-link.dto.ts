import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLinkDto {
  @IsString()
  @IsNotEmpty()
  url!: string;
}
