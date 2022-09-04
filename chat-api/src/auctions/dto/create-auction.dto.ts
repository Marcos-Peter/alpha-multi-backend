import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { AuctionEntity } from "../entities/auction.entity";

export class CreateAuctionDto extends AuctionEntity {
  @IsString()
  name: string;

  @IsString()
  details: string;

  @IsString()
  initialPrice: string;

  @IsString()
  currentPrice: string;

  // @IsDate()
  @IsNotEmpty()
  openAt: Date;

  @IsNumber()
  duration: number;
}
