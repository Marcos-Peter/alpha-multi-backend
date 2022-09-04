import { Auction } from "@prisma/client";

export class AuctionEntity implements Auction {
  id: string;
  name: string;
  details: string;
  photo: string | null;
  initialPrice: string;
  currentPrice: string;
  openAt: Date;
  duration: number;
  winnerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
