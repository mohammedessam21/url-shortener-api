import { Module } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { UrlShortenerController } from './url-shortener.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlShortener } from './entities/url-shortener.entity';

@Module({
   imports: [TypeOrmModule.forFeature([UrlShortener])],
  controllers: [UrlShortenerController],
  providers: [UrlShortenerService],
})
export class UrlShortenerModule {}
