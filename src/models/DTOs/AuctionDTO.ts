interface AuctionDTO
{
  auction_id?: string;
  winner_id?: string;
  name: string;
  description: string;
  photo: string;
  initial_price: string;
  winner_price?: string;
  open_at: string;
  created_at: string;
  updated_at?: string;
  close_at: string;
}

export { AuctionDTO };
