/* eslint-disable newline-per-chained-call */
import { AuctionDTO } from '../../models/DTOs/AuctionDTO';
import { DAO } from './DAO';
import { v4 as uuiv4 } from 'uuid';

class AuctionsDAO extends DAO
{
    getAuctionByID (auction_id: string)
    {
        const sql = `SELECT *
                    FROM auctions WHERE auction_id = $1`;

        return this.executeSQL<AuctionDTO>(sql, [ auction_id ]);
    }

    getAuctionByName (name: string)
    {
        const sql = `SELECT *
                    FROM auctions WHERE name = $1`;

        return this.executeSQL<AuctionDTO>(sql, [ name ]);
    }

    getAllAuctions ()
    {
        const sql = `SELECT *
                    FROM auctions`;
                    
        return this.executeSQL<AuctionDTO>(sql, []);
    }

    createAuction (auction: AuctionDTO)
    {
        const sql = `INSERT INTO auctions (
                                    auction_id, 
                                    name, 
                                    description, 
                                    photo, 
                                    initial_price, 
                                    duration, 
                                    open_at,
                                    created_at
                                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

        return this.executeSQL<AuctionDTO>(sql,
            [
                uuiv4(),
                auction.name,
                auction.description,
                auction.photo,
                auction.initial_price,
                auction.duration,
                auction.open_at,
                new Date().toISOString().split('T')[0],
            ]);
    }

    updateAuction (auction: AuctionDTO)
    {
        const sql = `UPDATE auctions SET (
                                    name, 
                                    description, 
                                    photo, 
                                    initial_price, 
                                    duration, 
                                    open_at,
                                    updated_at
                                ) = ($1, $2, $3, $4, $5, $6, $7)
                                WHERE auction_id = $8 
                                RETURNING *`;

        return this.executeSQL<AuctionDTO>(sql,
            [
                auction.name,
                auction.description,
                auction.photo,
                auction.initial_price,
                auction.duration,
                auction.open_at,
                new Date().toISOString().split('T')[0],
                auction.auction_id
            ]);
    }

    deleteAuction (auction_id: string)
    {
        const sql = 'DELETE FROM auctions WHERE auction_id = $1 RETURNING *';

        return this.executeSQL<AuctionDTO>(sql, [ auction_id ]);
    }

    closeAuction (auctionName: string, winner_id: string, final_price: string)
    {
        const sql = 'UPDATE auctions SET (winner_id, final_price, closed_at) = ($1, $2, $3) WHERE name = $4 RETURNING *';

        return this.executeSQL<AuctionDTO>(sql,
            [
                winner_id,
                final_price,
                new Date().toISOString().split('T')[0],
                auctionName
            ]);
    }
}

const auctionsDAO = new AuctionsDAO();
export { auctionsDAO };
