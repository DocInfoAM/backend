import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
      .then(() => {
        console.log('Prisma DB connect successful');
      })
      .catch((e) => {
        console.log('Prisma DB connect failure', e);
      });
  }
}
