import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getServerStatus(): string {
    return process.env.VERCEL_NODE_ENV !== 'production'
      ? 'Development Server DocInfoAM is working!'
      : 'Production Server DocInfoAM is working!';
  }
}
