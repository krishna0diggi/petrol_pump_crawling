import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MapmyIndiaAuthService {
  private readonly logger = new Logger(MapmyIndiaAuthService.name);

  private token: string | null = null;
  private expiry = 0;

  constructor(private readonly configService: ConfigService) {}

  async getAuthHeader(): Promise<string> {
    if (this.token && Date.now() < this.expiry) {
      return this.token;
    }

    const clientId = this.configService.get<string>('MAPMYINDIA_CLIENT_ID');
    const clientSecret = this.configService.get<string>('MAPMYINDIA_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new Error('MapmyIndia credentials are not configured');
    }

    const res = await axios.post(
      'https://outpost.mappls.com/api/security/oauth/token',
      null,
      {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'client_credentials',
        },
      },
    );

    this.token = `${res.data.token_type} ${res.data.access_token}`;
    this.expiry = Date.now() + (res.data.expires_in - 60) * 1000;

    this.logger.log('MapmyIndia token refreshed');
    return this.token;
  }
}
