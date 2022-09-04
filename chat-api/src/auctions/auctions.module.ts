import { Module } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuctionsRepository } from './repositories/auctions.repository';

@Module({
  controllers: [AuctionsController],
  providers: [AuctionsService, PrismaService, AuctionsRepository],
})
export class AuctionsModule {}
