interface AuctionDTO
{
  auction_id?: string;
  winner_id?: string;
  name: string;
  description: string;
  photo: string;
  initial_price: string;
  final_price?: string;
  duration: number;
  open_at: string;
  created_at: string;
  updated_at?: string;
  closed_at?: string;
}

export { AuctionDTO };
