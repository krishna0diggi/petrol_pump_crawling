import { Module } from '@nestjs/common';
import { MapmyIndiaAuthService } from './auth.service';
import { MapmyIndiaTextSearchClient } from './textsearch.client';

@Module({
  providers: [MapmyIndiaAuthService, MapmyIndiaTextSearchClient],
  exports: [MapmyIndiaTextSearchClient],
})
export class MapmyindiaModule {}
