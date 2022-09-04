import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { AuctionsModule } from './auctions/auctions.module';

@Module({
  imports: [UsersModule, AuctionsModule],
  controllers: [],
  providers: [AppGateway, PrismaService],
})
export class AppModule {}
