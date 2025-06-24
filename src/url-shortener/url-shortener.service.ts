import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import * as shortid from 'shortid';
import { UrlShortener } from './entities/url-shortener.entity';
import { CreateUrlShortenerDto } from './dto/create-url-shortener.dto';
import { UrlShortenerResponse } from 'src/common/url-shortener-response';
import { DEFAULT_EXPIRES_IN_DAYS } from 'src/common/constants';



@Injectable()
export class UrlShortenerService {
  constructor(
    @InjectRepository(UrlShortener)
    private readonly urlShortenerRepository: Repository<UrlShortener>,
    private readonly configService: ConfigService,
  ) { }

  async createShortUrl(createUrlDto: CreateUrlShortenerDto): Promise<{ shortUrl: string }> {
    

    const shortCode = shortid.generate();
    const expiresInDays = createUrlDto.expiresInDays ?? DEFAULT_EXPIRES_IN_DAYS;
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

    const url = this.urlShortenerRepository.create({
      originalUrl: createUrlDto.originalUrl,
      shortCode,
      expiresAt,
    });

    await this.urlShortenerRepository.save(url);

    const baseUrl = this.configService.get('BASE_URL');
    const fullShortUrl = `${baseUrl}/redirect/${shortCode}`;

    return { shortUrl: fullShortUrl };
  }

  async getOriginalUrl(shortCode: string): Promise<UrlShortenerResponse> {
    const url = await this.urlShortenerRepository.findOne({ where: { shortCode } });
    if (!url) {
      throw new NotFoundException('Short URL not found');
    }
    if (url.expiresAt < new Date()) {
      throw new BadRequestException('Short URL has expired');
    }

    url.accessCount++;
    await this.urlShortenerRepository.save(url);


    return {
      originalUrl:url.originalUrl,
      accessCount:url.accessCount,
      createdAt:url.createdAt,
      expiresAt:url.expiresAt,
  };
  }
}