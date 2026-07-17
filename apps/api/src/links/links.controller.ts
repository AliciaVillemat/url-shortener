import { Body, Controller, Post } from '@nestjs/common';

import { CreateLinkDto } from './dto/create-link.dto';
import { LinksService } from './links.service';
import type { CreatedLinkResponse } from './links.types';

@Controller('api/links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  create(@Body() dto: CreateLinkDto): Promise<CreatedLinkResponse> {
    return this.linksService.create(dto.url, dto.expiration);
  }
}
