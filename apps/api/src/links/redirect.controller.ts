import { Controller, Get, HttpStatus, Param, Redirect } from '@nestjs/common';

import { LinksService } from './links.service';

interface RedirectResponse {
  statusCode: typeof HttpStatus.FOUND;
  url: string;
}

@Controller()
export class RedirectController {
  constructor(private readonly linksService: LinksService) {}

  @Get(':code')
  @Redirect(undefined, HttpStatus.FOUND)
  async redirect(@Param('code') code: string): Promise<RedirectResponse> {
    return {
      statusCode: HttpStatus.FOUND,
      url: await this.linksService.findOriginalUrl(code),
    };
  }
}
