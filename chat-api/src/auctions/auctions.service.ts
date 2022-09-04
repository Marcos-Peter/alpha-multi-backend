import { Injectable } from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { AuctionsRepository } from './repositories/auctions.repository';

@Injectable()
export class AuctionsService {
  constructor(private readonly repository: AuctionsRepository) {}

  create(data: CreateAuctionDto) {
    return this.repository.create(data);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findOne(id);
  }

  update(id: string, data: UpdateAuctionDto) {
    return this.repository.update(id, data);
  }

  remove(id: string) {
    return this.repository.remove(id);
  }
}
