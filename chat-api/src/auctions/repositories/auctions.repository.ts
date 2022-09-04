import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAuctionDto } from "../dto/create-auction.dto";
import { UpdateAuctionDto } from "../dto/update-auction.dto";


@Injectable()
export class AuctionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateAuctionDto) {
    return this.prisma.auction.create({ data });
  }

  findAll() {
    return this.prisma.auction.findMany();
  }

  findOne(id: string) {
    return this.prisma.auction.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateAuctionDto) {
    return this.prisma.auction.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.auction.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}