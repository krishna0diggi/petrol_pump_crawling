import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { MapmyIndiaAuthService } from './auth.service';

@Injectable()
export class MapmyIndiaTextSearchClient {
  private readonly logger = new Logger(MapmyIndiaTextSearchClient.name);

  constructor(private readonly auth: MapmyIndiaAuthService) { }

  async search(params: {
    query: string;
    lat: number;
    lng: number;
    radius: number;
    page: number;
  }) {
    const authHeader = await this.auth.getAuthHeader();
    const url = 'https://atlas.mapmyindia.com/api/places/textsearch/json';

    this.logger.log(`API Call: ${url} (query="${params.query}", page=${params.page})`);

    return axios.get(url,
      {
        headers: { Authorization: authHeader },
        params: {
          query: params.query,
          location: `${params.lat},${params.lng}`,
          radius: params.radius,
          page: params.page,
          itemCount: 100,
          region: 'IND',
        },
      },
    );
  }
}
