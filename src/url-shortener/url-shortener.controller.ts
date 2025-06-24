import { Controller, Post, Body, Get, Param } from '@nestjs/common';

import { UrlShortenerService } from './url-shortener.service';
import { CreateUrlShortenerDto } from './dto/create-url-shortener.dto';

@Controller()
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Post('shorten')
  async shorten(@Body() createUrlDto: CreateUrlShortenerDto):Promise<{shortUrl: string}> {
    return await this.urlShortenerService.createShortUrl(createUrlDto);
  }

  @Get('redirect/:shortCode')
  async resolve(@Param('shortCode') code: string):Promise<{
    originalUrl: string;
    accessCount: number;
    createdAt: Date;
    expiresAt: Date;}> 
{
    return await this.urlShortenerService.getOriginalUrl(code);
  }
}