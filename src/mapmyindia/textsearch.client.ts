import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { MapmyIndiaAuthService } from './auth.service';

@Injectable()
export class MapmyIndiaTextSearchClient {
  constructor(private readonly auth: MapmyIndiaAuthService) {}

  async search(params: {
    query: string;
    lat: number;
    lng: number;
    radius: number;
    page: number;
  }) {
    const authHeader = await this.auth.getAuthHeader();

    return axios.get(
      'https://atlas.mapmyindia.com/api/places/textsearch/json',
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
